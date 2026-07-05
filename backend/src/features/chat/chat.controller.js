const { body, param } = require("express-validator");
const chatService = require("./chat.service");
const { success, created } = require("../../utils/response.util");

const startRules = [body("user_id").isUUID().withMessage("user_id must be a valid user id")];
const sendRules = [
  param("id").isUUID(),
  body("body").trim().isLength({ min: 1, max: 2000 }).withMessage("Message must be 1-2000 characters"),
];

async function startConversation(req, res, next) {
  try {
    const convo = await chatService.getOrCreateConversation(req.user.id, req.body.user_id, req.user.role);
    return created(res, convo, "Conversation ready");
  } catch (err) {
    next(err);
  }
}

async function listConversations(req, res, next) {
  try {
    const rows = await chatService.listConversations(req.user.id);
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const rows = await chatService.getMessages(req.params.id, req.user.id);
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function sendMessage(req, res, next) {
  try {
    const msg = await chatService.sendMessage({
      conversationId: req.params.id,
      senderId: req.user.id,
      body: req.body.body,
    });
    return created(res, msg, "Message sent");
  } catch (err) {
    next(err);
  }
}

module.exports = { startRules, sendRules, startConversation, listConversations, getMessages, sendMessage };
