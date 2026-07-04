const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const c = require("./authExtended.controller");

// Mounted under the same /auth prefix as the core auth routes.
const router = Router();

router.post("/forgot-password",   c.forgotRules,  validate, c.forgotPassword);
router.post("/reset-password",    c.resetRules,   validate, c.resetPassword);
router.post("/refresh-token",     c.refreshRules, validate, c.refreshToken);
router.post("/verify-email",      c.verifyRules,  validate, c.verifyEmail);
router.post("/send-verification", authenticate,             c.sendVerification);

module.exports = router;
