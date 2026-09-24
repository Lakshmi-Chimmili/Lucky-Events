const express = require('express');
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getFeaturedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  triggerEventReminders,
} = require('../controllers/eventController');
const {
  rsvpEvent,
  cancelRSVP,
  getEventRSVPs,
  getUserRSVPStatus,
} = require('../controllers/rsvpController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

const eventValidation = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),
  validate,
];

// Public / optionally authenticated
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/user/my-events', protect, getMyEvents);
router.get('/:id', optionalAuth, getEventById);

// Protected event management
router.post('/', protect, eventValidation, createEvent);
router.put('/:id', protect, eventValidation, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/send-reminders', protect, triggerEventReminders);

// Event RSVP actions
router.post('/:id/rsvp', protect, rsvpEvent);
router.delete('/:id/rsvp', protect, cancelRSVP);
router.get('/:id/rsvps', protect, getEventRSVPs);
router.get('/:id/rsvp/status', protect, getUserRSVPStatus);

module.exports = router;
