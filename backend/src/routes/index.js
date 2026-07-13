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
router.use("/recommendations", require("./recommendations.routes"));
router.use("/admin",         require("./admin.routes"));

// Feature modules (self-contained, per-feature folders under src/features/)
router.use("/uploads",       require("../features/uploads/uploads.routes"));
router.use("/reviews",       require("../features/reviews/reviews.routes"));
router.use("/chat",          require("../features/chat/chat.routes"));
router.use("/auth",          require("../features/auth-extended/authExtended.routes"));
router.use("/session",       require("../features/session/session.routes"));
router.use("/ai",            require("../features/ai-chat/aiChat.routes"));

module.exports = router;
