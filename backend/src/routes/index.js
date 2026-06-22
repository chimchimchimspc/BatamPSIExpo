const { Router } = require("express");
const router = Router();

router.use("/auth",          require("./auth.routes"));
router.use("/profile",       require("./profile.routes"));
router.use("/jobs",          require("./jobs.routes"));
router.use("/applications",  require("./applications.routes"));
router.use("/passport",      require("./passport.routes"));
router.use("/badges",        require("./badges.routes"));
router.use("/events",        require("./events.routes"));
router.use("/notifications", require("./notifications.routes"));
router.use("/admin",         require("./admin.routes"));

module.exports = router;
