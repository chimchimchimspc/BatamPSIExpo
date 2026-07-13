const { Router } = require("express");
const { authenticate, requireRole } = require("../../middleware/auth.middleware");
const c = require("./aiChat.controller");

const router = Router();

router.post("/chat", authenticate, requireRole("freelancer"), c.chat);

module.exports = router;
