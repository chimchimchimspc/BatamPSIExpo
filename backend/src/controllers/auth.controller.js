const { body } = require("express-validator");
const authService = require("../services/auth.service");
const { success, created, error } = require("../utils/response.util");
const { validate } = require("../middleware/validate.middleware");

const registerRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password min 8 characters"),
  body("full_name").trim().notEmpty().withMessage("Full name required"),
  body("role").optional().isIn(["freelancer", "employer"]),
  body("city").optional().trim(),
];

const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return created(res, result, "Registration successful");
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return success(res, result, "Login successful");
  } catch (err) {
    if (err.statusCode === 401) return error(res, err.message, 401);
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
  return success(res, null, "Logged out successfully");
}

module.exports = { register, registerRules, login, loginRules, me, logout, validate };
