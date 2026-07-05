const bcrypt = require("bcryptjs");
const { query, getClient } = require("../config/database");
const { signToken, signRefreshToken, decodeToken } = require("../utils/jwt.util");

async function register({ email, password, full_name, role = "freelancer", city = "Yogyakarta" }) {
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
    } else if (role === "employer") {
      await client.query(
        "INSERT INTO employer_profiles (user_id, company_name) VALUES ($1, $2)",
        [user.id, full_name]
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
    "SELECT id, email, full_name, role, password_hash, is_verified FROM users WHERE email = $1",
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

// Sign in / sign up with a Google ID token (credential from Google Identity Services).
// NOTE: For a real deployment the credential should be verified with google-auth-library
// against your Google Client ID. Here we only decode it (demo-grade), matching the
// existing client-side decode flow. Do NOT trust this in production.
async function loginWithGoogle({ credential }) {
  const payload = decodeToken(credential);
  if (!payload || !payload.email) {
    const err = new Error("Invalid Google credential");
    err.statusCode = 400;
    throw err;
  }

  const google_id = payload.sub;
  const email = String(payload.email).toLowerCase();
  const full_name = payload.name || email.split("@")[0];
  const avatar_url = payload.picture || null;

  // Existing user? Match by google_id or email.
  const existing = await query(
    "SELECT id, email, full_name, role, avatar_url FROM users WHERE google_id = $1 OR email = $2",
    [google_id, email]
  );

  if (existing.rowCount > 0) {
    const found = existing.rows[0];
    // Backfill google_id / avatar and update last login for returning users.
    const { rows } = await query(
      `UPDATE users
         SET google_id = COALESCE(google_id, $1),
             avatar_url = COALESCE($2, avatar_url),
             last_login = NOW()
       WHERE id = $3
       RETURNING id, email, full_name, role, avatar_url`,
      [google_id, avatar_url, found.id]
    );
    const user = rows[0];
    const token = signToken({ id: user.id, role: user.role, email: user.email });
    return { user: { ...user, avatar: user.avatar_url }, token };
  }

  // New user — create as a freelancer with supporting rows, in a transaction.
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO users (email, full_name, role, google_id, avatar_url, is_email_verified, last_login)
       VALUES ($1, $2, 'freelancer', $3, $4, TRUE, NOW())
       RETURNING id, email, full_name, role, avatar_url`,
      [email, full_name, google_id, avatar_url]
    );
    const user = rows[0];

    await client.query(
      "INSERT INTO freelancer_profiles (user_id, profile_picture_url) VALUES ($1, $2)",
      [user.id, avatar_url]
    );
    await client.query("INSERT INTO passport_progress (user_id) VALUES ($1)", [user.id]);

    await client.query("COMMIT");

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    return { user: { ...user, avatar: user.avatar_url }, token };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getMe(userId) {
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.city, u.is_verified, u.created_at,
            fp.bio, fp.profile_picture_url, fp.portfolio_url, fp.level,
            fp.rating, fp.review_count, fp.completed_projects, fp.passport_days_completed
     FROM users u
     LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = { register, login, loginWithGoogle, getMe };
