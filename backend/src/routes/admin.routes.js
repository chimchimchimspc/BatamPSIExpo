const { Router } = require("express");
const router = Router();
const c = require("../controllers/admin.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

const isAdmin = [authenticate, requireRole("admin")];

router.get("/analytics",              ...isAdmin, c.getDashboardAnalytics);
router.get("/jobs/pending",           ...isAdmin, c.getPendingJobs);
router.put("/jobs/:id/approve",       ...isAdmin, c.approveJob);
router.put("/jobs/:id/reject",        ...isAdmin, c.rejectJob);
router.get("/users",                  ...isAdmin, c.listUsers);
router.get("/badges/pending",         ...isAdmin, c.getPendingBadges);
router.put("/badges/:userBadgeId/verify", ...isAdmin, c.verifyUserBadge);

module.exports = router;
