const logger = require('../utils/logger');
const ResponseHelper = require('../utils/response');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return ResponseHelper.notFound(res, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return ResponseHelper.error(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return ResponseHelper.validationError(res, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return ResponseHelper.unauthorized(res, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return ResponseHelper.unauthorized(res, message);
  }

  // Default error response
  ResponseHelper.error(
    res,
    error.message || 'Internal Server Error',
    error.statusCode || 500
  );
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFound
};
