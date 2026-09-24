const User = require('../models/User');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, organization, avatar } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (organization !== undefined) user.organization = organization;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        organization: updatedUser.organization,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user aggregate statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Events organized by this user
    const organizedCount = await Event.countDocuments({ organizer: userId });

    // Events RSVP'd by this user
    const attendingCount = await RSVP.countDocuments({
      user: userId,
      status: 'attending',
    });

    // Total RSVPs across all events organized by this user
    const organizedEvents = await Event.find({ organizer: userId }).select('_id');
    const eventIds = organizedEvents.map((e) => e._id);

    const totalAttendeesReceived = await RSVP.countDocuments({
      event: { $in: eventIds },
      status: 'attending',
    });

    res.status(200).json({
      success: true,
      stats: {
        eventsOrganized: organizedCount,
        eventsAttending: attendingCount,
        totalAttendeesReceived,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  updatePassword,
  getUserStats,
};
