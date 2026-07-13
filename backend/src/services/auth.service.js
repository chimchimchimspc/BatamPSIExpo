const bcrypt = require("bcryptjs");
const { query, getClient } = require("../config/database");
const { signToken, signRefreshToken } = require("../utils/jwt.util");
const { setUserSkills } = require("./skill.service");

async function register({ email, password, full_name, role = "freelancer", city = "Yogyakarta", company_name, skills }) {
  const exists = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (exists.rowCount > 0) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 12);
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO users (email, password_hash, full_name, city, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, city, created_at`,
      [email, password_hash, full_name, city, role]
    );
    const user = rows[0];

    if (role === "freelancer") {
      await client.query(
        "INSERT INTO freelancer_profiles (user_id) VALUES ($1)",
        [user.id]
      );
      await client.query(
        "INSERT INTO passport_progress (user_id) VALUES ($1)",
        [user.id]
      );
      if (skills?.length) {
        await setUserSkills(client, user.id, skills);
      }
    } else if (role === "employer" || role === "event_organizer") {
      await client.query(
        "INSERT INTO employer_profiles (user_id, company_name) VALUES ($1, $2)",
        [user.id, company_name || full_name]
      );
    }

    await client.query("COMMIT");

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    return { user, token };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function login({ email, password }) {
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.password_hash, u.is_verified,
            COALESCE(fp.profile_picture_url, ep.company_logo_url) AS profile_picture_url,
            fp.level, fp.passport_days_completed
     FROM users u
     LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
     LEFT JOIN employer_profiles ep ON ep.user_id = u.id
     WHERE u.email = $1`,
    [email]
  );

  if (rows.length === 0) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  await query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

  const { password_hash: _, ...safeUser } = user;
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user: safeUser, token, refreshToken };
}

// Login / daftar via Google.
// - Jika GOOGLE_CLIENT_ID diset: verifikasi ID token asli ke server Google.
// - Jika tidak (mode demo untuk expo): terima { email, name } langsung.
async function googleLogin({ credential, email: demoEmail, name: demoName }) {
  let sub, email, name, picture;

  if (process.env.GOOGLE_CLIENT_ID) {
    // === Mode asli: verifikasi signature & klaim token di server Google ===
    const resp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!resp.ok) {
      const err = new Error("Token Google tidak valid");
      err.statusCode = 401;
      throw err;
    }
    const payload = await resp.json();

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      const err = new Error("Token Google tidak valid (audience mismatch)");
      err.statusCode = 401;
      throw err;
    }
    if (payload.email_verified !== "true" && payload.email_verified !== true) {
      const err = new Error("Email Google belum terverifikasi");
      err.statusCode = 401;
      throw err;
    }
    ({ sub, email, name, picture } = payload);
  } else {
    // === Mode demo: tanpa verifikasi Google (untuk keperluan expo/lokal) ===
    if (!demoEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoEmail)) {
      const err = new Error("Email Google tidak valid");
      err.statusCode = 400;
      throw err;
    }
    email = demoEmail.toLowerCase();
    name = demoName || email.split("@")[0];
    sub = `demo-google:${email}`;
    picture = null;
  }

  // Sudah pernah login Google, atau email sudah terdaftar → tautkan
  const existing = await query(
    "SELECT id, email, full_name, role, is_verified, google_sub FROM users WHERE google_sub = $1 OR email = $2 LIMIT 1",
    [sub, email]
  );

  let user;
  if (existing.rowCount > 0) {
    user = existing.rows[0];
    if (!user.google_sub) {
      await query("UPDATE users SET google_sub = $1 WHERE id = $2", [sub, user.id]);
    }
    await query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);
    // Ambil foto profil dari Google bila user belum punya foto
    if (picture) {
      await query(
        `UPDATE freelancer_profiles
         SET profile_picture_url = COALESCE(profile_picture_url, $1)
         WHERE user_id = $2`,
        [picture, user.id]
      );
    }
  } else {
    // User baru → daftarkan sebagai freelancer
    const client = await getClient();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `INSERT INTO users (email, full_name, city, role, google_sub, is_email_verified)
         VALUES ($1, $2, 'Yogyakarta', 'freelancer', $3, TRUE)
         RETURNING id, email, full_name, role, is_verified`,
        [email, name || email.split("@")[0], sub]
      );
      user = rows[0];
      await client.query(
        "INSERT INTO freelancer_profiles (user_id, profile_picture_url) VALUES ($1, $2)",
        [user.id, picture || null]
      );
      await client.query("INSERT INTO passport_progress (user_id) VALUES ($1)", [user.id]);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  // Ambil foto profil (Google picture tersimpan di freelancer_profiles)
  const photo = await query(
    `SELECT COALESCE(fp.profile_picture_url, ep.company_logo_url) AS profile_picture_url,
            fp.level, fp.passport_days_completed
     FROM users u
     LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
     LEFT JOIN employer_profiles ep ON ep.user_id = u.id
     WHERE u.id = $1`,
    [user.id]
  );

  const safeUser = { ...user, ...photo.rows[0] };
  delete safeUser.google_sub;
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user: safeUser, token, refreshToken };
}

async function getMe(userId) {
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.city, u.is_verified, u.created_at,
            fp.bio, COALESCE(fp.profile_picture_url, ep.company_logo_url) AS profile_picture_url,
            fp.portfolio_url, fp.level,
            fp.rating, fp.review_count, fp.completed_projects, fp.passport_days_completed
     FROM users u
     LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
     LEFT JOIN employer_profiles ep ON ep.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = { register, login, googleLogin, getMe };
