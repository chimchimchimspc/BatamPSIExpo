const { Router } = require("express");
const router = Router();
const c = require("../controllers/badges.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/",            c.listAllBadges);
router.get("/me",          authenticate, c.getUserBadges);
router.get("/:userId",     c.getUserBadges);

module.exports = router;
