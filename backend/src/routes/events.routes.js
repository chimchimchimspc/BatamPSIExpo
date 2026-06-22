const { Router } = require("express");
const router = Router();
const c = require("../controllers/events.controller");
const { authenticate, requireRole } = require("../middleware/auth.middleware");

router.get("/",                   c.listEvents);
router.get("/:id",                c.getEvent);
router.post("/",                  authenticate, requireRole("admin"), c.createEvent);
router.post("/:id/rsvp",          authenticate, c.rsvpEvent);
router.post("/:id/check-in",      authenticate, c.checkIn);

module.exports = router;
