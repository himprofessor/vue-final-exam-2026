const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

// Protects routes by requiring a valid "Authorization: Bearer <token>" header.
// On success, attaches the decoded payload to req.user so downstream
// controllers know WHO is making the request (used to scope tasks to
// their owner).
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authenticated. Please log in.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
}

module.exports = { requireAuth };
