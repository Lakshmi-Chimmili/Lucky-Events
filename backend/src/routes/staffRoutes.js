const express = require('express');
const { getStaffList, createStaff } = require('../controllers/staffController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin only routes
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', getStaffList);
router.post('/', createStaff);

module.exports = router;
