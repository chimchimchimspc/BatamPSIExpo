const { validationResult } = require("express-validator");
const { badRequest } = require("../utils/response.util");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return badRequest(res, "Validation failed", errors.array());
  }
  next();
}

module.exports = { validate };
