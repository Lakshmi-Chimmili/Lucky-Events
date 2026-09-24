const express = require('express');
const { body } = require('express-validator');
const {
  updateProfile,
  updatePassword,
  getUserStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect); // All user routes are protected

const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('bio').optional().isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  validate,
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  validate,
];

router.put('/profile', updateProfileValidation, updateProfile);
router.put('/password', updatePasswordValidation, updatePassword);
router.get('/stats', getUserStats);

module.exports = router;
