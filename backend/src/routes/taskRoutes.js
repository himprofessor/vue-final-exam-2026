const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router();

// All task routes require a logged-in user - tasks are always scoped
// to req.user.id inside the controller/model layer.
router.use(requireAuth);

const taskValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid date (YYYY-MM-DD)'),
];

router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.post('/', taskValidationRules, validate, taskController.create);
router.put('/:id', taskValidationRules, validate, taskController.update);
router.patch(
  '/:id/status',
  [body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status')],
  validate,
  taskController.updateStatus
);
router.delete('/:id', taskController.remove);

module.exports = router;
