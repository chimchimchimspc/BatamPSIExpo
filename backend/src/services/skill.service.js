/**
 * Simpan daftar skill milik user (replace semua).
 * Skill yang belum ada di tabel master akan dibuat otomatis, supaya pilihan
 * user tidak pernah hilang diam-diam hanya karena namanya belum terdaftar.
 *
 * Dipakai di dalam transaksi caller — `client` harus pg client aktif.
 */
async function setUserSkills(client, userId, skillNames) {
  if (!Array.isArray(skillNames)) return;

  const names = [...new Set(
    skillNames
      .filter((s) => typeof s === "string")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length <= 60)
  )].slice(0, 10);

  await client.query("DELETE FROM user_skills WHERE user_id = $1", [userId]);

  for (const name of names) {
    let skillRes = await client.query("SELECT id FROM skills WHERE name ILIKE $1", [name]);
    if (skillRes.rowCount === 0) {
      skillRes = await client.query(
        `INSERT INTO skills (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [name]
      );
    }
    await client.query(
      "INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, skillRes.rows[0].id]
    );
  }
}

module.exports = { setUserSkills };
