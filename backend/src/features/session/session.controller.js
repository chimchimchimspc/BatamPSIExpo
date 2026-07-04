const { success, badRequest } = require("../../utils/response.util");

// Per-feature data is namespaced under req.session.data[feature].
function ensureBag(req) {
  if (!req.session.data) req.session.data = {};
  return req.session.data;
}

// GET /session — whole session (user + all feature bags)
function getSession(req, res) {
  return success(res, {
    authenticated: !!req.session.user,
    user: req.session.user || null,
    data: req.session.data || {},
  });
}

// GET /session/:feature — one feature's stored data
function getFeature(req, res) {
  const bag = ensureBag(req);
  return success(res, bag[req.params.feature] ?? null);
}

// PUT /session/:feature — replace/merge a feature's data with the request body
function setFeature(req, res, next) {
  try {
    const { feature } = req.params;
    if (!feature) return badRequest(res, "Feature name required");
    const bag = ensureBag(req);
    const incoming = req.body ?? {};
    // Merge objects, otherwise replace (arrays/primitives).
    if (
      bag[feature] && typeof bag[feature] === "object" && !Array.isArray(bag[feature]) &&
      typeof incoming === "object" && !Array.isArray(incoming)
    ) {
      bag[feature] = { ...bag[feature], ...incoming };
    } else {
      bag[feature] = incoming;
    }
    req.session.save((err) => {
      if (err) return next(err);
      return success(res, bag[feature], "Saved to session");
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /session/:feature — clear one feature's bag
function clearFeature(req, res, next) {
  const bag = ensureBag(req);
  delete bag[req.params.feature];
  req.session.save((err) => {
    if (err) return next(err);
    return success(res, null, "Feature session cleared");
  });
}

// POST /session/logout — destroy the whole session
function destroySession(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("jfp.sid");
    return success(res, null, "Session destroyed");
  });
}

module.exports = { getSession, getFeature, setFeature, clearFeature, destroySession };
