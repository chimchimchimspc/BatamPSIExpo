const { body } = require("express-validator");
const reviewsService = require("./reviews.service");
const { success, created } = require("../../utils/response.util");

const createReviewRules = [
  body("reviewee_id").isUUID().withMessage("reviewee_id must be a valid user id"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be an integer 1-5"),
  body("job_id").optional({ nullable: true }).isUUID(),
  body("comment").optional({ nullable: true }).trim().isLength({ max: 1000 }),
];

async function createReview(req, res, next) {
  try {
    const review = await reviewsService.createReview({
      reviewer_id: req.user.id,
      reviewee_id: req.body.reviewee_id,
      job_id: req.body.job_id || null,
      rating: req.body.rating,
      comment: req.body.comment || null,
    });
    return created(res, review, "Review submitted");
  } catch (err) {
    next(err);
  }
}

async function getUserReviews(req, res, next) {
  try {
    const userId = req.params.userId || req.user.id;
    const data = await reviewsService.getReviewsForUser(userId);
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

module.exports = { createReview, createReviewRules, getUserReviews };
