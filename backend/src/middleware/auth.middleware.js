const { verifyToken } = require("../utils/jwt.util");
const { unauthorized, forbidden } = require("../utils/response.util");

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return unauthorized(res, "Access token required");
  }

  const token = header.split(" ")[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return unauthorized(res, "Invalid or expired token");
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    if (!roles.includes(req.user.role)) {
      return forbidden(res, "Insufficient permissions");
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
