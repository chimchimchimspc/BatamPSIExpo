const badgeService = require("../services/badge.service");
const { success, notFound } = require("../utils/response.util");

async function listAllBadges(req, res, next) {
  try {
    const badges = await badgeService.getAllBadges();
    return success(res, badges);
  } catch (err) {
    next(err);
  }
}

async function getUserBadges(req, res, next) {
  try {
    const userId = req.params.userId || req.user.id;
    const badges = await badgeService.getUserBadges(userId);
    return success(res, badges);
  } catch (err) {
    next(err);
  }
}

module.exports = { listAllBadges, getUserBadges };
