const { Router } = require("express");
const router = Router();
const c = require("../controllers/profile.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.get("/",               authenticate, (req, res, next) => {
  req.params.userId = req.user.id;
  c.getPublicProfile(req, res, next);
});
router.put("/",               authenticate, requireRole("freelancer"), c.updateProfile);
router.get("/employer",       authenticate, (req, res, next) => {
  req.params.userId = req.user.id;
  c.getEmployerProfile(req, res, next);
});
router.put("/employer",       authenticate, requireRole("employer"), c.updateEmployerProfile);
router.get("/:userId",        c.getPublicProfile);
router.get("/employer/:userId", c.getEmployerProfile);

module.exports = router;
