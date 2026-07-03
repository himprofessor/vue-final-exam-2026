const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');
const taskModel = require('../models/taskModel');

const getAll = catchAsync(async (req, res) => {
  const { status, category_id, search, page, limit } = req.query;

  const result = await taskModel.findAllForUser(req.user.id, {
    status,
    categoryId: category_id,
    search,
    page: page || 1,
    limit: limit || 10,
  });

  res.status(200).json({
    success: true,
    data: {
      tasks: result.tasks,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    },
  });
});

// GET /api/tasks/:id
const getOne = catchAsync(async (req, res, next) => {
  const task = await taskModel.findByIdForUser(req.params.id, req.user.id);
  if (!task) return next(new AppError('Task not found', 404));
  res.status(200).json({ success: true, data: { task } });
});

// POST /api/tasks
const create = catchAsync(async (req, res) => {
  const { title, description, status, priority, due_date, category_id } = req.body;

  const task = await taskModel.create({
    title,
    description,
    status,
    priority,
    dueDate: due_date,
    categoryId: category_id,
    userId: req.user.id,
  });

  res.status(201).json({ success: true, message: 'Task created successfully', data: { task } });
});

// PUT /api/tasks/:id
const update = catchAsync(async (req, res, next) => {
  const existing = await taskModel.findByIdForUser(req.params.id, req.user.id);
  if (!existing) return next(new AppError('Task not found', 404));

  const { title, description, status, priority, due_date, category_id } = req.body;

  const task = await taskModel.update(req.params.id, req.user.id, {
    title,
    description,
    status,
    priority,
    dueDate: due_date,
    categoryId: category_id,
  });

  res.status(200).json({ success: true, message: 'Task updated successfully', data: { task } });
});

// PATCH /api/tasks/:id/status  (bonus quick-toggle endpoint)
const updateStatus = catchAsync(async (req, res, next) => {
  const existing = await taskModel.findByIdForUser(req.params.id, req.user.id);
  if (!existing) return next(new AppError('Task not found', 404));

  const { status } = req.body;
  const task = await taskModel.updateStatus(req.params.id, req.user.id, status);
  res.status(200).json({ success: true, message: 'Task status updated successfully', data: { task } });
});

// DELETE /api/tasks/:id
const remove = catchAsync(async (req, res, next) => {
  const existing = await taskModel.findByIdForUser(req.params.id, req.user.id);
  if (!existing) return next(new AppError('Task not found', 404));

  await taskModel.remove(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});


module.exports = { getAll, getOne, create, update, updateStatus, remove };
