const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const c = require("./reviews.controller");

const router = Router();

router.post("/",         authenticate, c.createReviewRules, validate, c.createReview);
router.get("/me",        authenticate, c.getUserReviews);
router.get("/:userId",   c.getUserReviews);

module.exports = router;
