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

// Seperti authenticate, tapi tidak wajib — dipakai route publik
// yang ingin tahu siapa yang mengakses (mis. pelacak minat)
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.split(" ")[1]);
    } catch {
      // token invalid → perlakukan sebagai tamu
    }
  }
  next();
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

module.exports = { authenticate, optionalAuth, requireRole };
