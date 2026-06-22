const { query } = require("../config/database");
const { success, created, notFound, forbidden, badRequest, paginated } = require("../utils/response.util");
const { checkAndAwardBadge } = require("../services/badge.service");

async function submitApplication(req, res, next) {
  try {
    const { job_id, cover_letter } = req.body;

    if (!cover_letter || cover_letter.length > 300) {
      return badRequest(res, "Cover letter required, max 300 characters");
    }

    const job = await query("SELECT id, status FROM job_postings WHERE id = $1", [job_id]);
    if (!job.rows[0]) return notFound(res, "Job not found");
    if (job.rows[0].status !== "active") return badRequest(res, "Job is not accepting applications");

    const { rows } = await query(
      `INSERT INTO applications (job_id, freelancer_id, cover_letter)
       VALUES ($1, $2, $3)
       RETURNING id, status, submitted_at, expires_at`,
      [job_id, req.user.id, cover_letter]
    );

    const countRes = await query(
      "SELECT COUNT(*) FROM applications WHERE freelancer_id = $1",
      [req.user.id]
    );
    if (parseInt(countRes.rows[0].count) === 1) {
      await checkAndAwardBadge(req.user.id, "first_application");
    }

    return created(res, rows[0], "Application submitted successfully");
  } catch (err) {
    if (err.code === "23505") return badRequest(res, "You have already applied to this job");
    next(err);
  }
}

async function getMyApplications(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ["a.freelancer_id = $1"];
    const params = [req.user.id];
    let idx = 2;

    if (status) { conditions.push(`a.status = $${idx++}`); params.push(status); }

    const where = `WHERE ${conditions.join(" AND ")}`;
    const total = await query(
      `SELECT COUNT(*) FROM applications a ${where}`, params
    );

    const { rows } = await query(
      `SELECT a.id, a.status, a.submitted_at, a.reviewed_at, a.expires_at,
              a.cover_letter,
              jp.id AS job_id, jp.title AS job_title,
              ep.company_name AS company,
              jc.name AS category,
              jp.budget_min, jp.budget_max
       FROM applications a
       JOIN job_postings jp ON jp.id = a.job_id
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_categories jc ON jc.id = jp.category_id
       ${where}
       ORDER BY a.submitted_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return paginated(res, rows, parseInt(total.rows[0].count), page, limit);
  } catch (err) {
    next(err);
  }
}

async function getApplicationsForJob(req, res, next) {
  try {
    const { jobId } = req.params;
    const { status, sort = "newest" } = req.query;

    const job = await query("SELECT employer_id FROM job_postings WHERE id = $1", [jobId]);
    if (!job.rows[0]) return notFound(res, "Job not found");
    if (job.rows[0].employer_id !== req.user.id && req.user.role !== "admin") {
      return forbidden(res);
    }

    const conditions = ["a.job_id = $1"];
    const params = [jobId];
    let idx = 2;
    if (status) { conditions.push(`a.status = $${idx++}`); params.push(status); }

    const orderMap = { newest: "a.submitted_at DESC", rating: "fp.rating DESC" };
    const orderBy = orderMap[sort] || orderMap.newest;

    const { rows } = await query(
      `SELECT a.id, a.status, a.submitted_at, a.cover_letter,
              u.id AS freelancer_id, u.full_name AS name,
              fp.level, fp.rating, fp.completed_projects,
              fp.passport_days_completed,
              COALESCE(
                json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]'
              ) AS skills,
              (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = u.id) AS badge_count
       FROM applications a
       JOIN users u ON u.id = a.freelancer_id
       LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
       LEFT JOIN user_skills us ON us.user_id = u.id
       LEFT JOIN skills s ON s.id = us.skill_id
       WHERE ${conditions.join(" AND ")}
       GROUP BY a.id, u.id, fp.level, fp.rating, fp.completed_projects, fp.passport_days_completed
       ORDER BY ${orderBy}`,
      params
    );

    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["reviewed", "accepted", "rejected"];
    if (!allowed.includes(status)) return badRequest(res, "Invalid status");

    const appRes = await query(
      "SELECT a.*, jp.employer_id FROM applications a JOIN job_postings jp ON jp.id = a.job_id WHERE a.id = $1",
      [id]
    );
    if (!appRes.rows[0]) return notFound(res, "Application not found");
    if (appRes.rows[0].employer_id !== req.user.id && req.user.role !== "admin") {
      return forbidden(res);
    }

    const { rows } = await query(
      `UPDATE applications
       SET status = $1, reviewed_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    const app = appRes.rows[0];
    const msgMap = {
      accepted: "Selamat! Lamaran kamu diterima!",
      rejected: "Terima kasih telah melamar. Kali ini kami belum bisa menerima lamaran kamu.",
    };
    if (msgMap[status]) {
      await query(
        `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES ($1, 'application_update', $2, $3, $4, 'application')`,
        [app.freelancer_id, `Update Lamaran`, msgMap[status], id]
      );
    }

    return success(res, rows[0], "Status updated");
  } catch (err) {
    next(err);
  }
}

async function withdrawApplication(req, res, next) {
  try {
    const { id } = req.params;
    const appRes = await query(
      "SELECT freelancer_id, status FROM applications WHERE id = $1",
      [id]
    );
    if (!appRes.rows[0]) return notFound(res, "Application not found");
    if (appRes.rows[0].freelancer_id !== req.user.id) return forbidden(res);
    if (appRes.rows[0].status !== "pending") {
      return badRequest(res, "Cannot withdraw a reviewed application");
    }
    await query("DELETE FROM applications WHERE id = $1", [id]);
    return success(res, null, "Application withdrawn");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitApplication, getMyApplications,
  getApplicationsForJob, updateApplicationStatus, withdrawApplication,
};
