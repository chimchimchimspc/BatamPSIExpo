const { Router } = require("express");
const router = Router();
const c = require("../controllers/applications.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.post("/",                           authenticate, requireRole("freelancer"), c.submitApplication);
router.get("/",                            authenticate, c.getMyApplications);
router.get("/job/:jobId",                  authenticate, c.getApplicationsForJob);
router.put("/:id/status",                  authenticate, c.updateApplicationStatus);
router.delete("/:id/withdraw",             authenticate, requireRole("freelancer"), c.withdrawApplication);

module.exports = router;
