const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createCategory);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCategory);

module.exports = router;
