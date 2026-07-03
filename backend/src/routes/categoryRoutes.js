const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.use(requireAuth);

router.get('/', categoryController.getAll);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  categoryController.create
);

router.put(
  '/:id',
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  categoryController.update
);

router.delete('/:id', categoryController.remove);

module.exports = router;
