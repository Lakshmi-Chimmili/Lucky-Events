const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getAssignedBookings,
  updateBookingStatus,
  assignStaffToBooking,
  deleteBooking,
  getBookingStats,
} = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // All booking routes require authentication

// Customer / User routes
router.post('/', roleMiddleware('customer', 'staff', 'admin'), createBooking);
router.get('/my', roleMiddleware('customer', 'staff', 'admin'), getMyBookings);

// Staff route
router.get('/assigned', roleMiddleware('staff', 'admin'), getAssignedBookings);

// Admin routes
router.get('/stats', roleMiddleware('admin'), getBookingStats);
router.get('/', roleMiddleware('admin'), getAllBookings);
router.patch('/:id/assign', roleMiddleware('admin'), assignStaffToBooking);

// Shared status update & deletion
router.patch('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

module.exports = router;
