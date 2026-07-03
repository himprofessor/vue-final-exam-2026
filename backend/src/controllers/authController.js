const bcrypt = require('bcryptjs');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');
const userModel = require('../models/userModel');

// POST /api/auth/register
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await userModel.findByEmail(email);
  if (existing) {
    return next(new AppError('An account with this email already exists', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({ name, email, hashedPassword });

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user, token },
  });
});

// POST /api/auth/login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  // Never send the password hash back to the client
  const { password: _password, ...safeUser } = user;

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user: safeUser, token },
  });
});

// GET /api/auth/me  (protected - requires valid JWT)
const me = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({ success: true, data: { user } });
});

module.exports = { register, login, me };






