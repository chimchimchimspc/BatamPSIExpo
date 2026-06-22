const { Router } = require("express");
const router = Router();
const c = require("../controllers/passport.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.get("/journey",              authenticate, requireRole("freelancer"), c.getJourney);
router.get("/today-task",           authenticate, requireRole("freelancer"), c.getTodayTask);
router.get("/progress",             authenticate, requireRole("freelancer"), c.getProgress);
router.get("/daily/:dayNumber",     authenticate, requireRole("freelancer"), c.getDayDetail);
router.put("/mark-complete/:dayNumber", authenticate, requireRole("freelancer"), c.markComplete);

module.exports = router;
