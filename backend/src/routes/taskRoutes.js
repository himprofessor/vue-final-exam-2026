const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Enforce login for all routes below
router.use(requireAuth);

// Rules for Create and Update
const taskValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional({ checkFalsy: true }).isISO8601().withMessage('due_date must be a valid date (YYYY-MM-DD)')
];

// Status specific check
const statusValidationRules = [
  body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status')
];

// CRUD routes mapping
router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.post('/', taskValidationRules, validate, taskController.create);
router.put('/:id', taskValidationRules, validate, taskController.update);
router.patch('/:id/status', statusValidationRules, validate, taskController.updateStatus); // FIXED: Uses clean variable wrapper
router.delete('/:id', taskController.remove);


module.exports = router;
