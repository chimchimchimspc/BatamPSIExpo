const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const c = require("./chat.controller");

const router = Router();

router.get("/conversations",               authenticate, c.listConversations);
router.post("/conversations",              authenticate, c.startRules, validate, c.startConversation);
router.get("/conversations/:id/messages",  authenticate, c.getMessages);
router.post("/conversations/:id/messages", authenticate, c.sendRules, validate, c.sendMessage);

module.exports = router;
