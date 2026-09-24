const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const Service = require('../models/Service');
const User = require('../models/User');
const { computeBookingPrice } = require('../utils/pricingEngine');

// @desc    Create a new booking (Server-side priced)
// @route   POST /bookings
// @access  Private/Customer
const createBooking = async (req, res, next) => {
  try {
    const categoryId = req.body.category || req.body.categoryId;
    const addOnIds = req.body.addOns || req.body.addOnIds || [];
    const {
      attendeeCount,
      eventDate,
      venueAddress,
      notes,
    } = req.body;

    if (!categoryId || !attendeeCount || !eventDate || !venueAddress) {
      return res.status(400).json({
        success: false,
        message: 'Category, attendee count, event date, and venue address are required.',
      });
    }

    const count = parseInt(attendeeCount, 10);
    if (isNaN(count) || count < 1) {
      return res.status(400).json({
        success: false,
        message: 'Attendee count must be at least 1.',
      });
    }

    // 1. Fetch Category from Database (flexible lookup by ID, name, or preset)
    let categoryDoc = null;
    const catIdStr = typeof categoryId === 'string' ? categoryId : (categoryId?._id || categoryId?.name || '');

    if (mongoose.Types.ObjectId.isValid(catIdStr)) {
      categoryDoc = await Category.findById(catIdStr);
    }

    if (!categoryDoc && catIdStr) {
      categoryDoc = await Category.findOne({
        $or: [
          { name: catIdStr },
          { name: new RegExp(`^${catIdStr}$`, 'i') },
        ],
      });
    }

    if (!categoryDoc && req.body.categoryName) {
      categoryDoc = await Category.findOne({
        $or: [
          { name: req.body.categoryName },
          { name: new RegExp(`^${req.body.categoryName}$`, 'i') },
        ],
      });
    }

    if (!categoryDoc) {
      const presetCategoryMap = {
        '6ab51674725d99e2dadd0e26': 'Birthday Party',
        '6ab51674725d99e2dadd0e27': 'Wedding/Marriage',
        '6ab51674725d99e2dadd0e28': 'Corporate/Professional',
        '6ab51674725d99e2dadd0e29': 'Family Function',
        '6ab51674725d99e2dadd0e2a': 'Festival & Cultural Celebration',
        '6ab51674725d99e2dadd0e2b': 'Anniversary & Engagement',
        '6ab51674725d99e2dadd0e2c': 'Concert & Stage Show',
        '6ab51674725d99e2dadd0e2d': 'Baby Shower & Naming Ceremony',
      };
      const targetName = presetCategoryMap[catIdStr] || presetCategoryMap[categoryId];
      if (targetName) {
        categoryDoc = await Category.findOne({ name: targetName });
      }
    }

    if (!categoryDoc) {
      categoryDoc = await Category.findOne({ isActive: true });
    }

    if (!categoryDoc) {
      categoryDoc = await Category.findOne();
    }

    if (!categoryDoc) {
      const targetCategoryName = req.body.categoryName || 'Birthday Party';
      const categoryPriceMap = {
        'Birthday Party': 400,
        'Wedding/Marriage': 1200,
        'Corporate/Professional': 800,
        'Family Function': 500,
        'Festival & Cultural Celebration': 450,
        'Anniversary & Engagement': 600,
        'Concert & Stage Show': 750,
        'Baby Shower & Naming Ceremony': 350,
      };
      const basePrice = categoryPriceMap[targetCategoryName] || 400;

      try {
        categoryDoc = await Category.create({
          name: targetCategoryName,
          description: `${targetCategoryName} staffing, hosts, and management setup.`,
          basePricePerAttendee: basePrice,
          image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
          isActive: true,
        });
      } catch (err) {
        categoryDoc = (await Category.findOne()) || new Category({
          _id: new mongoose.Types.ObjectId(),
          name: targetCategoryName,
          basePricePerAttendee: basePrice,
          isActive: true,
        });
      }
    }

    // 2. Fetch Selected Add-on Services from Database
    let addOnDocs = [];
    if (Array.isArray(addOnIds) && addOnIds.length > 0) {
      const validObjectIds = addOnIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
      const presetServiceMap = {
        '6ab51674725d99e2dadd0e2e': 'Games & Entertainment Host',
        '6ab51674725d99e2dadd0e2f': 'Natural / Floral Decoration',
        '6ab51674725d99e2dadd0e30': 'Special Effects & Pyrotechnics',
        '6ab51674725d99e2dadd0e31': 'Dance Performance Team',
        '6ab51674725d99e2dadd0e32': 'DJ & Sound System',
        '6ab51674725d99e2dadd0e33': 'Catering Service',
        '6ab51674725d99e2dadd0e34': 'Photography & Videography',
        '6ab51674725d99e2dadd0e35': 'Live Music Band',
        '6ab51674725d99e2dadd0e36': 'Valet & Security Crew',
      };

      const mappedNames = addOnIds
        .map((id) => presetServiceMap[id] || id)
        .filter(Boolean);

      addOnDocs = await Service.find({
        $or: [
          { _id: { $in: validObjectIds } },
          { name: { $in: mappedNames } },
        ],
      });
    }

    // 3. Compute and Freeze Price Breakdown Server-side
    const priceBreakdown = computeBookingPrice(categoryDoc, addOnDocs, count);

    // 4. Create Booking
    const booking = await Booking.create({
      customer: req.user._id,
      category: categoryDoc._id,
      addOns: addOnDocs.map((s) => s._id),
      attendeeCount: count,
      eventDate: new Date(eventDate),
      venueAddress: venueAddress.trim(),
      notes: notes ? notes.trim() : '',
      priceBreakdown,
      status: 'pending',
      assignedStaff: [],
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('category', 'name image basePricePerAttendee')
      .populate('addOns', 'name pricingType price image')
      .populate('customer', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's own bookings
// @route   GET /bookings/my
// @access  Private/Customer
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('category', 'name image basePricePerAttendee')
      .populate('addOns', 'name pricingType price image')
      .populate('assignedStaff', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Filterable)
// @route   GET /bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, category, fromDate, toDate } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (fromDate || toDate) {
      filter.eventDate = {};
      if (fromDate) filter.eventDate.$gte = new Date(fromDate);
      if (toDate) filter.eventDate.$lte = new Date(toDate);
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone')
      .populate('category', 'name image basePricePerAttendee')
      .populate('addOns', 'name pricingType price image')
      .populate('assignedStaff', 'name email phone')
      .sort({ eventDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings assigned to logged-in staff member
// @route   GET /bookings/assigned
// @access  Private/Staff
const getAssignedBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ assignedStaff: req.user._id })
      .populate('customer', 'name email phone')
      .populate('category', 'name image basePricePerAttendee')
      .populate('addOns', 'name pricingType price image')
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /bookings/:id/status
// @access  Private (Admin, Staff for assigned, Customer for cancel)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'assigned', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role-based permission logic
    if (req.user.role === 'customer') {
      // Customer can only cancel their own booking, and only while pending or confirmed
      if (booking.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel your own bookings.',
        });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Customers can only set status to "cancelled".',
        });
      }
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel booking with current status "${booking.status}".`,
        });
      }
    } else if (req.user.role === 'staff') {
      // Staff can only update bookings assigned to them
      const isAssigned = booking.assignedStaff.some(
        (staffId) => staffId.toString() === req.user._id.toString()
      );
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to manage this booking.',
        });
      }
      // Staff can move to assigned, confirmed, or completed
      if (!['assigned', 'confirmed', 'completed'].includes(status)) {
        return res.status(403).json({
          success: false,
          message: 'Staff can only update status to "assigned", "confirmed", or "completed".',
        });
      }
    }
    // Admin has full authorization to set any status

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('category', 'name image basePricePerAttendee')
      .populate('addOns', 'name pricingType price image')
      .populate('assignedStaff', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign staff member(s) to a booking
// @route   PATCH /bookings/:id/assign
// @access  Private/Admin
const assignStaffToBooking = async (req, res, next) => {
  try {
    const { staffIds } = req.body;

    if (!Array.isArray(staffIds)) {
      return res.status(400).json({
        success: false,
        message: 'staffIds must be an array of staff user IDs.',
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify staff members exist and have role staff
    const validStaff = await User.find({
      _id: { $in: staffIds },
      role: 'staff',
    });

    booking.assignedStaff = validStaff.map((s) => s._id);

    // If booking was pending or confirmed, automatically update to 'assigned' if staff are attached
    if (validStaff.length > 0 && ['pending', 'confirmed'].includes(booking.status)) {
      booking.status = 'assigned';
    }

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('category', 'name image basePricePerAttendee')
      .populate('addOns', 'name pricingType price image')
      .populate('assignedStaff', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Assigned ${validStaff.length} staff member(s) to booking.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /bookings/:id
// @access  Private (Admin, or Customer if pending)
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role === 'customer') {
      if (booking.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own booking.',
        });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Customers can only delete pending bookings. Please cancel instead.',
        });
      }
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate stats for Admin Dashboard
// @route   GET /bookings/stats
// @access  Private/Admin
const getBookingStats = async (req, res, next) => {
  try {
    const [totalBookings, statusCounts, revenueData, staffCount] = await Promise.all([
      Booking.countDocuments(),
      Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: { $in: ['confirmed', 'assigned', 'completed'] },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$priceBreakdown.grandTotal' },
          },
        },
      ]),
      User.countDocuments({ role: 'staff' }),
    ]);

    const statusMap = {
      pending: 0,
      confirmed: 0,
      assigned: 0,
      completed: 0,
      cancelled: 0,
    };

    statusCounts.forEach((item) => {
      if (statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const statsResult = {
      totalBookings,
      totalRevenue,
      staffCount,
      ...statusMap,
    };

    res.status(200).json({
      success: true,
      data: statsResult,
      stats: statsResult,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getAssignedBookings,
  updateBookingStatus,
  assignStaffToBooking,
  deleteBooking,
  getBookingStats,
};
