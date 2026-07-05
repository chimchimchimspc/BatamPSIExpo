const { body } = require("express-validator");
const authService = require("../services/auth.service");
const { success, created, error } = require("../utils/response.util");
const { validate } = require("../middleware/validate.middleware");

const registerRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password min 8 characters"),
  body("full_name").trim().notEmpty().withMessage("Full name required"),
  body("role").optional().isIn(["freelancer", "employer", "event_organizer"]),
  body("city").optional().trim(),
  body("company_name").optional().trim(),
];

const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

function attachSession(req, user) {
  // Establish a server-side session alongside the JWT.
  if (req.session) {
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
    };
  }
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    attachSession(req, result.user);
    return created(res, result, "Registration successful");
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    attachSession(req, result.user);
    return success(res, result, "Login successful");
  } catch (err) {
    if (err.statusCode === 401) return error(res, err.message, 401);
    next(err);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { credential, email, name } = req.body;
    if (!credential && !email) {
      return error(res, "credential (token Google) atau email diperlukan", 400);
    }
    const result = await authService.googleLogin({ credential, email, name });
    attachSession(req, result.user);
    return success(res, result, "Login successful");
  } catch (err) {
    if (err.statusCode) return error(res, err.message, err.statusCode);
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie("jfp.sid");
      return success(res, null, "Logged out successfully");
    });
    return;
  }
  return success(res, null, "Logged out successfully");
}

module.exports = { register, registerRules, login, loginRules, googleLogin, me, logout, validate };
