const { Router } = require("express");
const router = Router();
const c = require("../controllers/jobs.controller");
const { authenticate, optionalAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/",       c.listJobs);
router.get("/mine",   authenticate, requireRole("employer", "event_organizer", "admin"), c.getMyJobs);
router.get("/:id",    optionalAuth, c.getJob);
router.post("/",      authenticate, requireRole("employer", "event_organizer", "admin"), c.createJob);
router.put("/:id",    authenticate, c.updateJob);
router.delete("/:id", authenticate, c.deleteJob);

module.exports = router;
