const { Router } = require("express");
const router = Router();
const c = require("../controllers/jobs.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.get("/",       c.listJobs);
router.get("/:id",    c.getJob);
router.post("/",      authenticate, requireRole("employer", "admin"), c.createJob);
router.put("/:id",    authenticate, c.updateJob);
router.delete("/:id", authenticate, c.deleteJob);

module.exports = router;
