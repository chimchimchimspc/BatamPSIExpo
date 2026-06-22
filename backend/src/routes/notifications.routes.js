const { Router } = require("express");
const router = Router();
const c = require("../controllers/notifications.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/",                authenticate, c.getNotifications);
router.put("/read-all",        authenticate, c.markAllRead);
router.put("/:id/read",        authenticate, c.markRead);
router.delete("/:id",          authenticate, c.deleteNotification);

module.exports = router;
