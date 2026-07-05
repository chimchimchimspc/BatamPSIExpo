const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { pool } = require("../../config/database");

// Server-side session backed by PostgreSQL (table auto-created on first run).
// Complements the existing JWT auth — used to persist per-feature state per user.
const sessionMiddleware = session({
  store: new pgSession({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  name: "jfp.sid",
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "change_me_session_secret_min_32_chars",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

module.exports = { sessionMiddleware };
