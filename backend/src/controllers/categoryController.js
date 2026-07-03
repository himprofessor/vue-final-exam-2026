const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');
const categoryModel = require('../models/categoryModel');

// GET /api/categories
const getAll = catchAsync(async (req, res) => {
  const rawCategories = await categoryModel.findAll(req.user.id);
  const categories = rawCategories.map(cat => ({
    ...cat,
    task_count: Number(cat.task_count || 0)
  }));
  res.status(200).json({ success: true, data: { categories } });
});

// POST /api/categories
const create = catchAsync(async (req, res) => {
  const { name, color } = req.body;
  const category = await categoryModel.create({ name, color: color || '#6366f1' });
  res.status(201).json({ success: true, message: 'Category created', data: { category } });
});

// PUT /api/categories/:id
const update = catchAsync(async (req, res, next) => {
  const existing = await categoryModel.findById(req.params.id);
  if (!existing) return next(new AppError('Category not found', 404));

  const { name, color } = req.body;
  const category = await categoryModel.update(req.params.id, { name, color });
  res.status(200).json({ success: true, message: 'Category updated', data: { category } });
});

// DELETE /api/categories/:id
const remove = catchAsync(async (req, res, next) => {
  const existing = await categoryModel.findById(req.params.id);
  if (!existing) return next(new AppError('Category not found', 404));

  await categoryModel.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = { getAll, create, update, remove };
