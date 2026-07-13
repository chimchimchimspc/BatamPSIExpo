const { Router } = require("express");
const router = Router();
const c = require("../controllers/admin.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

const isAdmin = [authenticate, requireRole("admin")];

router.get("/analytics",              ...isAdmin, c.getDashboardAnalytics);
router.get("/analytics/detail",       ...isAdmin, c.getAnalyticsDetail);
router.get("/jobs",                   ...isAdmin, c.listAllJobs);
router.get("/jobs/pending",           ...isAdmin, c.getPendingJobs);
router.put("/jobs/:id/approve",       ...isAdmin, c.approveJob);
router.put("/jobs/:id/reject",        ...isAdmin, c.rejectJob);
router.delete("/jobs/:id",            ...isAdmin, c.deleteJob);
router.get("/events",                 ...isAdmin, c.listAllEvents);
router.get("/events/pending",         ...isAdmin, c.getPendingEvents);
router.put("/events/:id/approve",     ...isAdmin, c.approveEvent);
router.put("/events/:id/reject",      ...isAdmin, c.rejectEvent);
router.delete("/events/:id",          ...isAdmin, c.deleteEvent);
router.get("/users",                  ...isAdmin, c.listUsers);
router.get("/badges/pending",         ...isAdmin, c.getPendingBadges);
router.put("/badges/:userBadgeId/verify", ...isAdmin, c.verifyUserBadge);
router.get("/categories",             ...isAdmin, c.listCategories);
router.post("/categories",            ...isAdmin, c.createCategory);
router.put("/categories/:id",         ...isAdmin, c.updateCategory);
router.delete("/categories/:id",      ...isAdmin, c.deleteCategory);
router.get("/skills",                 ...isAdmin, c.listSkills);
router.post("/skills",                ...isAdmin, c.createSkill);
router.put("/skills/:id",             ...isAdmin, c.updateSkill);
router.delete("/skills/:id",          ...isAdmin, c.deleteSkill);

module.exports = router;
