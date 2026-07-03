const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Runs after express-validator's check(...) rules. If any rule failed,
// collect the first message and turn it into a clean 422 response
// instead of letting bad data reach the controller/database.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return next(new AppError(firstError, 422));
  }
  next();
}

module.exports = validate;
