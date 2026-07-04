const { Router } = require("express");
const { authenticate, requireRole } = require("../../middleware/auth.middleware");
const { handleUpload } = require("./uploads.middleware");
const c = require("./uploads.controller");

const router = Router();

// Freelancers upload their profile picture and portfolio/CV.
router.post("/avatar",    authenticate, requireRole("freelancer"), handleUpload("avatar"),    c.uploadAvatar);
router.post("/portfolio", authenticate, requireRole("freelancer"), handleUpload("portfolio"), c.uploadPortfolio);

module.exports = router;
