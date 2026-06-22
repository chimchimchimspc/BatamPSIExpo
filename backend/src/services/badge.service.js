const { query } = require("../config/database");

async function checkAndAwardBadge(userId, triggerCondition) {
  const badgeRes = await query(
    "SELECT id, name, icon, requires_admin_verification FROM badges WHERE trigger_condition = $1",
    [triggerCondition]
  );
  if (badgeRes.rowCount === 0) return null;

  const badge = badgeRes.rows[0];

  const exists = await query(
    "SELECT id FROM user_badges WHERE user_id = $1 AND badge_id = $2",
    [userId, badge.id]
  );
  if (exists.rowCount > 0) return null;

  const isVerified = !badge.requires_admin_verification;

  const { rows } = await query(
    `INSERT INTO user_badges (user_id, badge_id, is_active)
     VALUES ($1, $2, $3)
     RETURNING id, earned_at`,
    [userId, badge.id, isVerified]
  );

  await query(
    `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
     VALUES ($1, 'badge_earned', $2, $3, $4, 'badge')`,
    [userId, `Badge Baru: ${badge.name}!`, `Selamat! Kamu mendapatkan badge "${badge.name}" ${badge.icon}`, badge.id]
  );

  return { ...badge, earned_at: rows[0].earned_at };
}

async function getUserBadges(userId) {
  const { rows } = await query(
    `SELECT b.id, b.name, b.icon, b.description, b.rarity,
            ub.earned_at, ub.is_active
     FROM user_badges ub
     JOIN badges b ON b.id = ub.badge_id
     WHERE ub.user_id = $1
     ORDER BY ub.earned_at DESC`,
    [userId]
  );
  return rows;
}

async function getAllBadges() {
  const { rows } = await query(
    "SELECT id, name, icon, description, rarity, trigger_condition FROM badges ORDER BY rarity"
  );
  return rows;
}

async function verifyBadge(userBadgeId, adminId) {
  const { rows } = await query(
    `UPDATE user_badges
     SET verified_by = $1, verified_at = NOW(), is_active = TRUE
     WHERE id = $2
     RETURNING *`,
    [adminId, userBadgeId]
  );
  return rows[0] || null;
}

module.exports = { checkAndAwardBadge, getUserBadges, getAllBadges, verifyBadge };
