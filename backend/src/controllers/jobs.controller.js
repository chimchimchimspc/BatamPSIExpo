const { query, getClient } = require("../config/database");
const { success, created, notFound, forbidden, paginated } = require("../utils/response.util");
const { sendJobMatchNotifications } = require("../services/notification.service");

async function listJobs(req, res, next) {
  try {
    const {
      page = 1, limit = 20,
      category, location_type, experience_level,
      budget_min, budget_max,
      skill, sort = "newest", search,
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = ["jp.status = 'active'"];
    const params = [];
    let idx = 1;

    if (category) { conditions.push(`jc.name = $${idx++}`); params.push(category); }
    if (location_type) { conditions.push(`jp.location_type = $${idx++}`); params.push(location_type); }
    if (experience_level) { conditions.push(`jp.experience_level = $${idx++}`); params.push(experience_level); }
    if (budget_min) { conditions.push(`jp.budget_max >= $${idx++}`); params.push(budget_min); }
    if (budget_max) { conditions.push(`jp.budget_min <= $${idx++}`); params.push(budget_max); }
    if (search) {
      conditions.push(`(jp.title ILIKE $${idx} OR jp.description ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (skill) {
      conditions.push(`EXISTS (
        SELECT 1 FROM job_skills js2
        JOIN skills s2 ON s2.id = js2.skill_id
        WHERE js2.job_id = jp.id AND s2.name ILIKE $${idx++}
      )`);
      params.push(`%${skill}%`);
    }

    const orderMap = {
      newest: "jp.created_at DESC",
      budget_high: "jp.budget_max DESC NULLS LAST",
      deadline: "jp.deadline_date ASC NULLS LAST",
      popular: "jp.view_count DESC",
    };
    const orderBy = orderMap[sort] || orderMap.newest;

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countRes = await query(
      `SELECT COUNT(*) FROM job_postings jp LEFT JOIN job_categories jc ON jc.id = jp.category_id ${where}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    const { rows } = await query(
      `SELECT jp.id, jp.title, ep.company_name AS company,
              jc.name AS category, jp.description,
              jp.budget_min, jp.budget_max, jp.budget_type,
              jp.deadline_days, jp.deadline_date,
              jp.location, jp.location_type, jp.experience_level,
              jp.view_count, jp.application_count, jp.created_at,
              COALESCE(
                json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]'
              ) AS skills
       FROM job_postings jp
       LEFT JOIN job_categories jc ON jc.id = jp.category_id
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_skills js ON js.job_id = jp.id
       LEFT JOIN skills s ON s.id = js.skill_id
       ${where}
       GROUP BY jp.id, ep.company_name, jc.name
       ORDER BY ${orderBy}
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return paginated(res, rows, total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function getJob(req, res, next) {
  try {
    const { id } = req.params;

    await query("UPDATE job_postings SET view_count = view_count + 1 WHERE id = $1", [id]);

    const { rows } = await query(
      `SELECT jp.id, jp.title, ep.company_name AS company,
              jc.name AS category, jp.description,
              jp.budget_min, jp.budget_max, jp.budget_type,
              jp.deadline_days, jp.deadline_date,
              jp.location, jp.location_type, jp.experience_level,
              jp.contact_whatsapp, jp.contact_email,
              jp.view_count, jp.application_count,
              jp.status, jp.created_at,
              COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills,
              COALESCE(json_agg(DISTINCT jr.requirement ORDER BY jr.order_index)
                FILTER (WHERE jr.requirement IS NOT NULL), '[]') AS requirements
       FROM job_postings jp
       LEFT JOIN job_categories jc ON jc.id = jp.category_id
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_skills js ON js.job_id = jp.id
       LEFT JOIN skills s ON s.id = js.skill_id
       LEFT JOIN job_requirements jr ON jr.job_id = jp.id
       WHERE jp.id = $1
       GROUP BY jp.id, ep.company_name, jc.name`,
      [id]
    );

    if (!rows[0]) return notFound(res, "Job not found");
    return success(res, rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createJob(req, res, next) {
  try {
    const {
      title, category_id, description,
      budget_min, budget_max, budget_type,
      deadline_days, deadline_date,
      location, location_type, experience_level,
      contact_whatsapp, contact_email,
      skills = [], requirements = [],
    } = req.body;

    const client = await getClient();
    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `INSERT INTO job_postings
           (employer_id, title, category_id, description, budget_min, budget_max, budget_type,
            deadline_days, deadline_date, location, location_type, experience_level,
            contact_whatsapp, contact_email, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending_review')
         RETURNING *`,
        [req.user.id, title, category_id, description, budget_min, budget_max, budget_type,
         deadline_days, deadline_date, location, location_type, experience_level,
         contact_whatsapp, contact_email]
      );
      const job = rows[0];

      for (const skillName of skills) {
        const skillRes = await client.query(
          "SELECT id FROM skills WHERE name ILIKE $1", [skillName]
        );
        if (skillRes.rowCount > 0) {
          await client.query(
            "INSERT INTO job_skills (job_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [job.id, skillRes.rows[0].id]
          );
        }
      }

      for (let i = 0; i < requirements.length; i++) {
        await client.query(
          "INSERT INTO job_requirements (job_id, requirement, order_index) VALUES ($1, $2, $3)",
          [job.id, requirements[i], i]
        );
      }

      await client.query(
        "UPDATE employer_profiles SET total_jobs_posted = total_jobs_posted + 1 WHERE user_id = $1",
        [req.user.id]
      );

      await client.query("COMMIT");
      return created(res, job, "Job submitted for review");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

async function updateJob(req, res, next) {
  try {
    const { id } = req.params;
    const job = await query("SELECT employer_id, status FROM job_postings WHERE id = $1", [id]);
    if (!job.rows[0]) return notFound(res, "Job not found");
    if (job.rows[0].employer_id !== req.user.id && req.user.role !== "admin") {
      return forbidden(res);
    }

    const fields = ["title", "description", "budget_min", "budget_max", "budget_type",
      "deadline_days", "deadline_date", "location", "location_type", "experience_level",
      "contact_whatsapp", "contact_email"];

    const updates = [];
    const params = [];
    let idx = 1;
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${idx++}`);
        params.push(req.body[field]);
      }
    }
    if (!updates.length) return success(res, null, "No changes");

    params.push(id);
    const { rows } = await query(
      `UPDATE job_postings SET ${updates.join(", ")}, status = 'pending_review', updated_at = NOW()
       WHERE id = $${idx} RETURNING *`,
      params
    );

    return success(res, rows[0], "Job updated");
  } catch (err) {
    next(err);
  }
}

async function deleteJob(req, res, next) {
  try {
    const { id } = req.params;
    const job = await query("SELECT employer_id FROM job_postings WHERE id = $1", [id]);
    if (!job.rows[0]) return notFound(res, "Job not found");
    if (job.rows[0].employer_id !== req.user.id && req.user.role !== "admin") {
      return forbidden(res);
    }
    await query("DELETE FROM job_postings WHERE id = $1", [id]);
    return success(res, null, "Job deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = { listJobs, getJob, createJob, updateJob, deleteJob };
