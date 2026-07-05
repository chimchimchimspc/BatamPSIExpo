const { query, getClient } = require("../config/database");
const { checkAndAwardBadge } = require("./badge.service");

const BADGE_DAYS = {
  5:  "day_5_milestone",
  15: "day_15_milestone",
  30: "day_30_complete",
};

async function getProgress(userId) {
  const { rows } = await query(
    `SELECT pp.current_day, pp.start_date, pp.level, pp.completed_at,
            array_agg(pdc.day_number ORDER BY pdc.day_number) FILTER (WHERE pdc.day_number IS NOT NULL) AS completed_days,
            (SELECT COALESCE(json_agg(b.name), '[]')
             FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
             WHERE ub.user_id = pp.user_id) AS earned_badges,
            (SELECT COUNT(*)::int FROM passport_day_completions c WHERE c.user_id = pp.user_id) AS days_completed
     FROM passport_progress pp
     LEFT JOIN passport_day_completions pdc ON pdc.user_id = pp.user_id
     WHERE pp.user_id = $1
     GROUP BY pp.user_id, pp.current_day, pp.start_date, pp.level, pp.completed_at`,
    [userId]
  );
  return rows[0] || null;
}

async function markDayComplete(userId, dayNumber) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO passport_day_completions (user_id, day_number)
       VALUES ($1, $2)
       ON CONFLICT (user_id, day_number) DO NOTHING`,
      [userId, dayNumber]
    );

    const nextDay = Math.min(dayNumber + 1, 30);
    await client.query(
      `UPDATE passport_progress
       SET current_day = GREATEST(current_day, $2),
           completed_at = CASE WHEN $2 = 30 THEN NOW() ELSE completed_at END
       WHERE user_id = $1`,
      [userId, nextDay]
    );

    // Naikkan level berdasarkan jumlah hari selesai:
    // Bronze (default) → Silver (10) → Gold (20) → Platinum (30)
    const cntRes = await client.query(
      "SELECT COUNT(*)::int AS cnt FROM passport_day_completions WHERE user_id = $1",
      [userId]
    );
    const daysDone = cntRes.rows[0].cnt;
    const level =
      daysDone >= 30 ? "Platinum" :
      daysDone >= 20 ? "Gold" :
      daysDone >= 10 ? "Silver" : "Bronze";

    await client.query(
      "UPDATE passport_progress SET level = $2 WHERE user_id = $1",
      [userId, level]
    );
    await client.query(
      `UPDATE freelancer_profiles
       SET passport_days_completed = $2, level = $3, updated_at = NOW()
       WHERE user_id = $1`,
      [userId, daysDone, level]
    );

    await client.query("COMMIT");

    let awardedBadge = null;
    if (BADGE_DAYS[dayNumber]) {
      awardedBadge = await checkAndAwardBadge(userId, BADGE_DAYS[dayNumber]);
    }

    const progress = await getProgress(userId);
    // Frontend membaca field `badge_awarded`
    return { progress, badge_awarded: awardedBadge };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getProgress, markDayComplete };
