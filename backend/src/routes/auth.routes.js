const { Router } = require("express");
const router = Router();
const c = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { loginLimiter } = require("../middleware/rateLimiter.middleware");

router.post("/register", c.registerRules, c.validate, c.register);
router.post("/login",    loginLimiter, c.loginRules, c.validate, c.login);
router.post("/logout",   authenticate, c.logout);
router.get("/me",        authenticate, c.me);

module.exports = router;
