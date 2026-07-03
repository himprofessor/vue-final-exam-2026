// =====================================================================
// Central error-handling middleware.
// Express recognizes this as an error handler because it takes 4 args
// (err, req, res, next). ANY error passed to next(err), or thrown inside
// an async controller wrapped with catchAsync, ends up here.
// =====================================================================
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong on the server';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

// Catches 404s for routes that don't exist
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = { errorHandler, notFound };
