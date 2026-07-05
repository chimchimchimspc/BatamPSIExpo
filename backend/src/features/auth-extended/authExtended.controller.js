const { body } = require("express-validator");
const svc = require("./authExtended.service");
const { success } = require("../../utils/response.util");

const forgotRules = [body("email").isEmail().normalizeEmail()];
const resetRules = [
  body("token").notEmpty(),
  body("password").isLength({ min: 8 }).withMessage("Password min 8 characters"),
];
const verifyRules = [body("token").notEmpty()];
const refreshRules = [body("refreshToken").notEmpty()];

async function forgotPassword(req, res, next) {
  try {
    const result = await svc.requestPasswordReset(req.body.email);
    return success(res, result, "If the email exists, a reset link has been sent");
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    await svc.resetPassword(req.body.token, req.body.password);
    return success(res, null, "Password reset successful");
  } catch (err) {
    next(err);
  }
}

async function sendVerification(req, res, next) {
  try {
    const result = await svc.requestEmailVerification(req.user.id);
    return success(res, result, "Verification email sent");
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const result = await svc.verifyEmail(req.body.token);
    return success(res, result, "Email verified");
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const result = await svc.refreshAccessToken(req.body.refreshToken);
    return success(res, result, "Token refreshed");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  forgotRules,
  resetRules,
  verifyRules,
  refreshRules,
  forgotPassword,
  resetPassword,
  sendVerification,
  verifyEmail,
  refreshToken,
};
