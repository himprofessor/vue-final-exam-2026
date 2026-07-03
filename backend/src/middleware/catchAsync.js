// Wraps an async route handler so we don't need try/catch in every
// single controller. Any rejected promise is forwarded to next(),
// which routes it to our errorHandler middleware.
module.exports = function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
