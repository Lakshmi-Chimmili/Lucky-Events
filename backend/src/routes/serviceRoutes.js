const express = require('express');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createService);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateService);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteService);

module.exports = router;
