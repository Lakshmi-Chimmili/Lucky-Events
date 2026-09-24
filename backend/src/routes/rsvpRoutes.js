const express = require('express');
const { getMyRSVPs } = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/my-rsvps', getMyRSVPs);

module.exports = router;
