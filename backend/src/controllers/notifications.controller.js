const notifService = require("../services/notification.service");
const { success, notFound } = require("../utils/response.util");

async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await notifService.getNotifications(req.user.id, { page, limit });
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const result = await notifService.markRead(req.params.id, req.user.id);
    if (!result) return notFound(res, "Notification not found");
    return success(res, null, "Marked as read");
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    await notifService.markAllRead(req.user.id);
    return success(res, null, "All notifications marked as read");
  } catch (err) {
    next(err);
  }
}

async function deleteNotification(req, res, next) {
  try {
    const result = await notifService.deleteNotification(req.params.id, req.user.id);
    if (!result) return notFound(res, "Notification not found");
    return success(res, null, "Notification deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };
