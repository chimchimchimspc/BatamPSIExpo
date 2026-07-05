const { Router } = require("express");
const router = Router();
const c = require("../controllers/profile.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");
const { uploadPhoto } = require("../middleware/upload.middleware");

router.get("/",               authenticate, (req, res, next) => {
  req.params.userId = req.user.id;
  c.getPublicProfile(req, res, next);
});
router.put("/",               authenticate, requireRole("freelancer"), c.updateProfile);
router.post("/photo",         authenticate, uploadPhoto, c.uploadProfilePhoto);
router.get("/employer",       authenticate, (req, res, next) => {
  req.params.userId = req.user.id;
  c.getEmployerProfile(req, res, next);
});
router.put("/employer",       authenticate, requireRole("employer", "event_organizer"), c.updateEmployerProfile);
router.get("/:userId",        c.getPublicProfile);
router.get("/employer/:userId", c.getEmployerProfile);

module.exports = router;
