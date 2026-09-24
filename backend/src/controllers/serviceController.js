const Service = require('../models/Service');

// @desc    Get all add-on services
// @route   GET /services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const { name, description, image, pricingType, price, isActive } = req.body;

    if (!name || !pricingType || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, pricingType (flat or perAttendee), and price are required.',
      });
    }

    if (!['flat', 'perAttendee'].includes(pricingType)) {
      return res.status(400).json({
        success: false,
        message: 'pricingType must be either "flat" or "perAttendee".',
      });
    }

    const existing = await Service.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A service with this name already exists.',
      });
    }

    const service = await Service.create({
      name: name.trim(),
      description: description || '',
      image: image || undefined,
      pricingType,
      price: Number(price),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully!',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const { name, description, image, pricingType, price, isActive } = req.body;

    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (name) service.name = name.trim();
    if (description !== undefined) service.description = description;
    if (image !== undefined) service.image = image;
    if (pricingType) {
      if (!['flat', 'perAttendee'].includes(pricingType)) {
        return res.status(400).json({
          success: false,
          message: 'pricingType must be either "flat" or "perAttendee".',
        });
      }
      service.pricingType = pricingType;
    }
    if (price !== undefined) service.price = Number(price);
    if (isActive !== undefined) service.isActive = Boolean(isActive);

    const updated = await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
