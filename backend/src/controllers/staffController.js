const User = require('../models/User');

// @desc    Get all staff members
// @route   GET /staff
// @access  Private/Admin
const getStaffList = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new staff account
// @route   POST /staff
// @access  Private/Admin
const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required for staff account.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const passwordHash = await User.hashPassword(password);

    const staffUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone ? phone.trim() : '',
      role: 'staff',
    });

    res.status(201).json({
      success: true,
      message: 'Staff account created successfully!',
      data: {
        id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        phone: staffUser.phone,
        role: staffUser.role,
        createdAt: staffUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStaffList,
  createStaff,
};
