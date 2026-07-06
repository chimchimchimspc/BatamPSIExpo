const { Router } = require("express");
const router = Router();
const c = require("../controllers/events.controller");
const { authenticate, optionalAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/",                   c.listEvents);
router.get("/mine",               authenticate, requireRole("admin", "employer", "event_organizer"), c.getMyEvents);
router.get("/attended",           authenticate, c.getMyAttendedEvents);
router.get("/:id/attendees",      authenticate, requireRole("admin", "employer", "event_organizer"), c.getEventAttendees);
router.get("/:id",                optionalAuth, c.getEvent);
router.post("/",                  authenticate, requireRole("admin", "employer", "event_organizer"), c.createEvent);
router.post("/:id/rsvp",          authenticate, c.rsvpEvent);
router.post("/:id/check-in",      authenticate, c.checkIn);
router.put("/:id/complete",       authenticate, requireRole("admin", "employer", "event_organizer"), c.completeEvent);

module.exports = router;
