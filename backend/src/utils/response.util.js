function success(res, data = null, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function created(res, data = null, message = "Created") {
  return success(res, data, message, 201);
}

function error(res, message = "Internal Server Error", statusCode = 500, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

function notFound(res, message = "Resource not found") {
  return error(res, message, 404);
}

function unauthorized(res, message = "Unauthorized") {
  return error(res, message, 401);
}

function forbidden(res, message = "Forbidden") {
  return error(res, message, 403);
}

function badRequest(res, message = "Bad Request", errors = null) {
  return error(res, message, 400, errors);
}

function paginated(res, rows, total, page, limit) {
  return res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
}

module.exports = { success, created, error, notFound, unauthorized, forbidden, badRequest, paginated };
