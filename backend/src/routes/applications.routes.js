const { Router } = require("express");
const router = Router();
const c = require("../controllers/applications.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.post("/",                           authenticate, requireRole("freelancer"), c.submitApplication);
router.get("/",                            authenticate, c.getMyApplications);
router.get("/employer",                    authenticate, requireRole("employer", "event_organizer", "admin"), c.getEmployerApplications);
router.get("/job/:jobId",                  authenticate, c.getApplicationsForJob);
router.put("/:id/status",                  authenticate, c.updateApplicationStatus);
router.put("/:id/submit-work",             authenticate, requireRole("freelancer"), c.submitWork);
router.put("/:id/complete",                authenticate, c.completeApplication);
router.put("/:id/request-revision",        authenticate, c.requestRevision);
router.put("/:id/terminate",               authenticate, c.terminateApplication);
router.delete("/:id/withdraw",             authenticate, requireRole("freelancer"), c.withdrawApplication);

module.exports = router;
