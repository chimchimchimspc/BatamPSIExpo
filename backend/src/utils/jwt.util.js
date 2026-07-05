const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "change_me_in_production_min_32_chars";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

// Decode a JWT payload WITHOUT verifying the signature.
// Used for Google ID tokens (demo-grade — see auth.service.loginWithGoogle note).
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = { signToken, signRefreshToken, verifyToken, decodeToken };
