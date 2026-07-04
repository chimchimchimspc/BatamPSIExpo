const { query } = require("../../config/database");
const { success, badRequest } = require("../../utils/response.util");

function publicUrl(req, relPath) {
  return `${req.protocol}://${req.get("host")}/uploads/${relPath}`;
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return badRequest(res, "No file uploaded (field 'avatar')");
    const url = publicUrl(req, `avatars/${req.file.filename}`);
    await query(
      "UPDATE freelancer_profiles SET profile_picture_url = $1, updated_at = NOW() WHERE user_id = $2",
      [url, req.user.id]
    );
    return success(res, { profile_picture_url: url }, "Profile picture uploaded");
  } catch (err) {
    next(err);
  }
}

async function uploadPortfolio(req, res, next) {
  try {
    if (!req.file) return badRequest(res, "No file uploaded (field 'portfolio')");
    const url = publicUrl(req, `portfolios/${req.file.filename}`);
    await query(
      "UPDATE freelancer_profiles SET portfolio_url = $1, updated_at = NOW() WHERE user_id = $2",
      [url, req.user.id]
    );
    return success(res, { portfolio_url: url }, "Portfolio/CV uploaded");
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadAvatar, uploadPortfolio };
