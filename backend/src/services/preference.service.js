const { query } = require("../config/database");

// Catat bahwa user membuka lowongan/event dengan kategori/tipe tertentu.
// Dipanggil fire-and-forget dari route detail — tidak boleh menggagalkan request utama.
async function trackView(userId, kind, value) {
  if (!userId || !value) return;
  try {
    await query(
      `INSERT INTO user_view_preferences (user_id, kind, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, kind, value)
       DO UPDATE SET view_count = user_view_preferences.view_count + 1, last_viewed = NOW()`,
      [userId, kind, value]
    );
  } catch (err) {
    console.error("trackView error:", err.message);
  }
}

// Kategori/tipe yang paling sering dibuka user
async function getTopPreferences(userId, kind, limit = 3) {
  const { rows } = await query(
    `SELECT value, view_count FROM user_view_preferences
     WHERE user_id = $1 AND kind = $2
     ORDER BY view_count DESC, last_viewed DESC
     LIMIT $3`,
    [userId, kind, limit]
  );
  return rows;
}

module.exports = { trackView, getTopPreferences };
