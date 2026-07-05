const { Router } = require("express");
const router = Router();
const c = require("../controllers/recommendations.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.get("/", authenticate, requireRole("freelancer"), c.getRecommendations);

module.exports = router;
