const { query } = require("../config/database");
const { success, notFound, badRequest } = require("../utils/response.util");
const { sendJobMatchNotifications } = require("../services/notification.service");
const { verifyBadge } = require("../services/badge.service");

async function getDashboardAnalytics(req, res, next) {
  try {
    const [users, activeJobs, pendingJobs, events, pendingBadges, appsToday, newUsers, checkIns] = await Promise.all([
      query("SELECT COUNT(*) FROM users"),
      query("SELECT COUNT(*) FROM job_postings WHERE status = 'active'"),
      query("SELECT COUNT(*) FROM job_postings WHERE status = 'pending_review'"),
      query("SELECT COUNT(*) FROM events"),
      query("SELECT COUNT(*) FROM user_badges ub JOIN badges b ON b.id = ub.badge_id WHERE b.requires_admin_verification = TRUE AND ub.verified_at IS NULL"),
      query("SELECT COUNT(*) FROM applications WHERE submitted_at >= CURRENT_DATE"),
      query("SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"),
      query("SELECT COUNT(*) FROM event_attendance WHERE checked_in = TRUE AND checked_in_at >= CURRENT_DATE - INTERVAL '7 days'"),
    ]);

    return success(res, {
      totalUsers:               parseInt(users.rows[0].count),
      activeJobs:               parseInt(activeJobs.rows[0].count),
      pendingJobs:              parseInt(pendingJobs.rows[0].count),
      totalEvents:              parseInt(events.rows[0].count),
      pendingBadgeVerifications:parseInt(pendingBadges.rows[0].count),
      jobApplicationsToday:     parseInt(appsToday.rows[0].count),
      newUsersThisWeek:         parseInt(newUsers.rows[0].count),
      checkInsThisWeek:         parseInt(checkIns.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
}

async function getPendingJobs(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT jp.id, jp.title, ep.company_name, jc.name AS category,
              jp.budget_min, jp.budget_max, jp.contact_email, jp.created_at
       FROM job_postings jp
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_categories jc ON jc.id = jp.category_id
       WHERE jp.status = 'pending_review'
       ORDER BY jp.created_at ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function approveJob(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `UPDATE job_postings
       SET status = 'active', reviewed_by = $1, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status = 'pending_review'
       RETURNING *`,
      [req.user.id, id]
    );
    if (!rows[0]) return notFound(res, "Job not found or already reviewed");

    await sendJobMatchNotifications({ id, company_name: rows[0].contact_email });

    return success(res, rows[0], "Job approved and published");
  } catch (err) {
    next(err);
  }
}

async function rejectJob(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { rows } = await query(
      `UPDATE job_postings
       SET status = 'rejected', admin_notes = $1, reviewed_by = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 AND status = 'pending_review'
       RETURNING *, employer_id`,
      [reason, req.user.id, id]
    );
    if (!rows[0]) return notFound(res, "Job not found or already reviewed");

    await query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, 'job_rejected', 'Lowongan Ditolak', $2, $3, 'job')`,
      [rows[0].employer_id, reason || "Lowongan tidak memenuhi standar platform", id]
    );

    return success(res, null, "Job rejected");
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (role) { conditions.push(`u.role = $${idx++}`); params.push(role); }
    if (search) {
      conditions.push(`(u.full_name ILIKE $${idx} OR u.email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const total = await query(`SELECT COUNT(*) FROM users u ${where}`, params);

    const { rows } = await query(
      `SELECT u.id, u.email, u.full_name, u.role, u.city, u.is_verified, u.created_at, u.last_login
       FROM users u
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return success(res, { rows, total: parseInt(total.rows[0].count) });
  } catch (err) {
    next(err);
  }
}

async function verifyUserBadge(req, res, next) {
  try {
    const { userBadgeId } = req.params;
    const result = await verifyBadge(userBadgeId, req.user.id);
    if (!result) return notFound(res, "User badge not found");
    return success(res, result, "Badge verified");
  } catch (err) {
    next(err);
  }
}

async function getPendingBadges(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT ub.id AS user_badge_id, ub.earned_at,
              u.id AS user_id, u.full_name, u.email,
              b.name AS badge_name, b.icon, b.rarity,
              ea.event_id, e.title AS event_title
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       JOIN users u ON u.id = ub.user_id
       LEFT JOIN event_attendance ea ON ea.user_id = ub.user_id AND ea.badge_awarded = TRUE
       LEFT JOIN events e ON e.id = ea.event_id
       WHERE b.requires_admin_verification = TRUE AND ub.verified_at IS NULL
       ORDER BY ub.earned_at ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardAnalytics, getPendingJobs, approveJob, rejectJob,
  listUsers, verifyUserBadge, getPendingBadges,
};
