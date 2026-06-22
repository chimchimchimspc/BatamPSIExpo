const { query, getClient } = require("../config/database");
const { success, notFound, forbidden } = require("../utils/response.util");
const { checkAndAwardBadge } = require("../services/badge.service");

async function getPublicProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const { rows } = await query(
      `SELECT u.id, u.full_name, u.city, u.role, u.created_at,
              fp.bio, fp.profile_picture_url, fp.portfolio_url,
              fp.level, fp.rating, fp.review_count,
              fp.completed_projects, fp.passport_days_completed,
              COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills,
              COALESCE(
                json_agg(DISTINCT jsonb_build_object('name', b.name, 'icon', b.icon, 'rarity', b.rarity))
                FILTER (WHERE b.name IS NOT NULL), '[]'
              ) AS badges
       FROM users u
       LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
       LEFT JOIN user_skills us ON us.user_id = u.id
       LEFT JOIN skills s ON s.id = us.skill_id
       LEFT JOIN user_badges ub ON ub.user_id = u.id AND ub.is_active = TRUE
       LEFT JOIN badges b ON b.id = ub.badge_id
       WHERE u.id = $1
       GROUP BY u.id, fp.bio, fp.profile_picture_url, fp.portfolio_url,
                fp.level, fp.rating, fp.review_count, fp.completed_projects, fp.passport_days_completed`,
      [userId]
    );
    if (!rows[0]) return notFound(res, "User not found");
    return success(res, rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { full_name, city, bio, portfolio_url } = req.body;
    const client = await getClient();

    try {
      await client.query("BEGIN");

      if (full_name || city) {
        const userUpdates = [];
        const userParams = [];
        let idx = 1;
        if (full_name) { userUpdates.push(`full_name = $${idx++}`); userParams.push(full_name); }
        if (city) { userUpdates.push(`city = $${idx++}`); userParams.push(city); }
        userParams.push(userId);
        await client.query(
          `UPDATE users SET ${userUpdates.join(", ")}, updated_at = NOW() WHERE id = $${idx}`,
          userParams
        );
      }

      if (bio !== undefined || portfolio_url !== undefined) {
        const fpUpdates = [];
        const fpParams = [];
        let idx = 1;
        if (bio !== undefined) { fpUpdates.push(`bio = $${idx++}`); fpParams.push(bio); }
        if (portfolio_url !== undefined) { fpUpdates.push(`portfolio_url = $${idx++}`); fpParams.push(portfolio_url); }
        fpParams.push(userId);
        await client.query(
          `UPDATE freelancer_profiles SET ${fpUpdates.join(", ")}, updated_at = NOW() WHERE user_id = $${idx}`,
          fpParams
        );
      }

      if (req.body.skills?.length) {
        await client.query("DELETE FROM user_skills WHERE user_id = $1", [userId]);
        for (const skillName of req.body.skills) {
          const skillRes = await client.query(
            "SELECT id FROM skills WHERE name ILIKE $1", [skillName]
          );
          if (skillRes.rowCount > 0) {
            await client.query(
              "INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
              [userId, skillRes.rows[0].id]
            );
          }
        }
      }

      await client.query("COMMIT");

      const profileComplete = await isProfileComplete(userId, client);
      if (profileComplete) {
        await checkAndAwardBadge(userId, "profile_complete");
      }

      return success(res, null, "Profile updated");
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

async function isProfileComplete(userId, client) {
  const db = client || { query: (...a) => query(...a) };
  const { rows } = await db.query(
    `SELECT u.full_name, u.city,
            fp.bio, fp.portfolio_url,
            (SELECT COUNT(*) FROM user_skills us WHERE us.user_id = u.id) AS skill_count
     FROM users u
     LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  if (!rows[0]) return false;
  const r = rows[0];
  return r.full_name && r.city && r.bio && r.portfolio_url && parseInt(r.skill_count) >= 3;
}

async function getEmployerProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const { rows } = await query(
      `SELECT u.id, u.full_name, u.city, u.created_at,
              ep.company_name, ep.industry, ep.company_description,
              ep.company_logo_url, ep.website_url, ep.location,
              ep.total_jobs_posted, ep.total_hired
       FROM users u
       JOIN employer_profiles ep ON ep.user_id = u.id
       WHERE u.id = $1 AND u.role = 'employer'`,
      [userId]
    );
    if (!rows[0]) return notFound(res, "Employer not found");
    return success(res, rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateEmployerProfile(req, res, next) {
  try {
    const userId = req.user.id;
    if (req.user.role !== "employer") return forbidden(res);
    const { company_name, industry, company_description, website_url, location } = req.body;
    const updates = [];
    const params = [];
    let idx = 1;
    if (company_name) { updates.push(`company_name = $${idx++}`); params.push(company_name); }
    if (industry) { updates.push(`industry = $${idx++}`); params.push(industry); }
    if (company_description) { updates.push(`company_description = $${idx++}`); params.push(company_description); }
    if (website_url) { updates.push(`website_url = $${idx++}`); params.push(website_url); }
    if (location) { updates.push(`location = $${idx++}`); params.push(location); }
    if (!updates.length) return success(res, null, "No changes");
    params.push(userId);
    await query(`UPDATE employer_profiles SET ${updates.join(", ")}, updated_at = NOW() WHERE user_id = $${idx}`, params);
    return success(res, null, "Employer profile updated");
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublicProfile, updateProfile, getEmployerProfile, updateEmployerProfile };
