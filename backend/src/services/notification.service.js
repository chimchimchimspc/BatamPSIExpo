const { query } = require("../config/database");

async function getNotifications(userId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const { rows } = await query(
    `SELECT id, type, title, message, is_read, related_id, related_type, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const total = await query("SELECT COUNT(*) FROM notifications WHERE user_id = $1", [userId]);
  return { rows, total: parseInt(total.rows[0].count) };
}

async function markRead(notificationId, userId) {
  const { rows } = await query(
    "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING id",
    [notificationId, userId]
  );
  return rows[0] || null;
}

async function markAllRead(userId) {
  await query(
    "UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE",
    [userId]
  );
}

async function deleteNotification(notificationId, userId) {
  const { rows } = await query(
    "DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id",
    [notificationId, userId]
  );
  return rows[0] || null;
}

async function sendJobMatchNotifications(job) {
  const { rows: freelancers } = await query(
    `SELECT DISTINCT u.id
     FROM users u
     JOIN user_skills us ON us.user_id = u.id
     JOIN job_skills js ON js.skill_id = us.skill_id AND js.job_id = $1
     WHERE u.role = 'freelancer'`,
    [job.id]
  );

  if (freelancers.length === 0) return;

  const values = freelancers
    .map((_, i) => `($${i * 5 + 1}, 'job_match', $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, 'job')`)
    .join(", ");

  const params = freelancers.flatMap((f) => [
    f.id,
    `Lowongan Baru: ${job.title}`,
    `Ada lowongan baru yang cocok dengan skill kamu dari ${job.company_name || "Employer"}`,
    job.id,
  ]);

  await query(`INSERT INTO notifications (user_id, type, title, message, related_id, related_type) VALUES ${values}`, params);
}

module.exports = { getNotifications, markRead, markAllRead, deleteNotification, sendJobMatchNotifications };
