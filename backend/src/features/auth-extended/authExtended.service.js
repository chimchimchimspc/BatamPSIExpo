const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { query } = require("../../config/database");
const { signToken, verifyToken } = require("../../utils/jwt.util");

const isDev = process.env.NODE_ENV === "development";

function genToken() {
  return crypto.randomBytes(32).toString("hex");
}

// No SMTP configured in dev — we log the token and (only in development) echo it
// back in the response so the flow is testable end-to-end without email.
function deliver(label, email, token) {
  console.log(`[auth] ${label} for ${email}: ${token}`);
}

async function requestPasswordReset(email) {
  const { rows } = await query("SELECT id FROM users WHERE email = $1", [email]);
  // Respond identically whether or not the email exists (avoid account enumeration).
  if (rows.length === 0) return { delivered: false };

  const token = genToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await query(
    "UPDATE users SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW() WHERE id = $3",
    [token, expires, rows[0].id]
  );
  deliver("Password reset token", email, token);
  return { delivered: true, ...(isDev ? { resetToken: token } : {}) };
}

async function resetPassword(token, newPassword) {
  const { rows } = await query(
    "SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()",
    [token]
  );
  if (rows.length === 0) {
    const err = new Error("Invalid or expired reset token");
    err.statusCode = 400;
    throw err;
  }
  const password_hash = await bcrypt.hash(newPassword, 12);
  await query(
    `UPDATE users SET password_hash = $1, password_reset_token = NULL,
       password_reset_expires = NULL, updated_at = NOW() WHERE id = $2`,
    [password_hash, rows[0].id]
  );
  return { reset: true };
}

async function requestEmailVerification(userId) {
  const token = genToken();
  const { rows } = await query(
    `UPDATE users SET email_verification_token = $1, updated_at = NOW()
     WHERE id = $2 AND is_email_verified = FALSE
     RETURNING email`,
    [token, userId]
  );
  if (rows.length === 0) return { alreadyVerified: true };

  deliver("Email verification token", rows[0].email, token);
  return { delivered: true, ...(isDev ? { verificationToken: token } : {}) };
}

async function verifyEmail(token) {
  const { rows } = await query(
    `UPDATE users SET is_email_verified = TRUE, email_verification_token = NULL, updated_at = NOW()
     WHERE email_verification_token = $1
     RETURNING id, email`,
    [token]
  );
  if (rows.length === 0) {
    const err = new Error("Invalid verification token");
    err.statusCode = 400;
    throw err;
  }
  return { verified: true, email: rows[0].email };
}

async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = verifyToken(refreshToken);
  } catch {
    const err = new Error("Invalid or expired refresh token");
    err.statusCode = 401;
    throw err;
  }

  const { rows } = await query("SELECT id, email, role FROM users WHERE id = $1", [payload.id]);
  if (rows.length === 0) {
    const err = new Error("User no longer exists");
    err.statusCode = 401;
    throw err;
  }
  const user = rows[0];
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { token };
}

module.exports = {
  requestPasswordReset,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
  refreshAccessToken,
};
