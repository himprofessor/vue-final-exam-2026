// A small custom Error class that carries an HTTP status code.
// Controllers throw this and the central error handler middleware
// (middleware/errorHandler.js) turns it into a clean JSON response.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
