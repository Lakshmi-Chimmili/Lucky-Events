const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const { sendRSVPConfirmation, sendRSVPCancellation } = require('../services/emailService');

// @desc    Submit or update RSVP for an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const { guestCount = 1, notes = '' } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This event has been cancelled and cannot accept RSVPs.',
      });
    }

    // Check if event is in the past
    if (new Date(event.startDate) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return res.status(400).json({
        success: false,
        message: 'This event has already occurred.',
      });
    }

    // Check if user already has an RSVP
    let existingRSVP = await RSVP.findOne({ event: eventId, user: userId });

    const requestedGuests = Math.min(Math.max(Number(guestCount) || 1, 1), 10);

    // Calculate available seats
    const currentAttendingCount = await RSVP.aggregate([
      { $match: { event: event._id, status: 'attending' } },
      { $group: { _id: null, total: { $sum: '$guestCount' } } },
    ]);
    const totalOccupied = currentAttendingCount[0]?.total || 0;

    let targetStatus = 'attending';
    let isWaitlist = false;

    // If existing RSVP was already attending, subtract its guests to check capacity
    const priorGuests = (existingRSVP && existingRSVP.status === 'attending') ? existingRSVP.guestCount : 0;
    if (totalOccupied - priorGuests + requestedGuests > event.capacity) {
      targetStatus = 'waitlist';
      isWaitlist = true;
    }

    let rsvp;
    if (existingRSVP) {
      existingRSVP.status = targetStatus;
      existingRSVP.guestCount = requestedGuests;
      existingRSVP.notes = notes;
      rsvp = await existingRSVP.save();
    } else {
      rsvp = await RSVP.create({
        event: eventId,
        user: userId,
        status: targetStatus,
        guestCount: requestedGuests,
        notes,
      });
    }

    // Update event rsvpCount
    const newAttendingCount = await RSVP.aggregate([
      { $match: { event: event._id, status: 'attending' } },
      { $group: { _id: null, total: { $sum: '$guestCount' } } },
    ]);
    event.rsvpCount = newAttendingCount[0]?.total || 0;
    await event.save();

    // Send confirmation email asynchronously
    sendRSVPConfirmation({
      user: req.user,
      event,
      rsvp,
    }).catch((err) => console.error('Failed to send confirmation email:', err.message));

    res.status(200).json({
      success: true,
      message: isWaitlist
        ? 'Event is at maximum capacity. You have been placed on the waitlist!'
        : 'RSVP confirmed! A confirmation email has been sent.',
      rsvp,
      isWaitlist,
      updatedRsvpCount: event.rsvpCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an RSVP
// @route   DELETE /api/events/:id/rsvp
// @access  Private
const cancelRSVP = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const rsvp = await RSVP.findOne({ event: eventId, user: userId });
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'No active RSVP found for this event.',
      });
    }

    rsvp.status = 'cancelled';
    await rsvp.save();

    // Recalculate event rsvpCount
    const newAttendingCount = await RSVP.aggregate([
      { $match: { event: event._id, status: 'attending' } },
      { $group: { _id: null, total: { $sum: '$guestCount' } } },
    ]);
    event.rsvpCount = newAttendingCount[0]?.total || 0;
    await event.save();

    // Send cancellation email in background
    sendRSVPCancellation({
      user: req.user,
      event,
    }).catch((err) => console.error('Failed to send cancellation email:', err.message));

    res.status(200).json({
      success: true,
      message: 'Your RSVP has been cancelled successfully.',
      updatedRsvpCount: event.rsvpCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's all RSVPs
// @route   GET /api/rsvps/my-rsvps
// @access  Private
const getMyRSVPs = async (req, res, next) => {
  try {
    const rsvps = await RSVP.find({
      user: req.user.id,
      status: { $in: ['attending', 'waitlist'] },
    })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email avatar organization' },
      })
      .sort({ createdAt: -1 });

    // Filter out null events (in case an event was deleted)
    const validRSVPs = rsvps.filter((r) => r.event != null);

    res.status(200).json({
      success: true,
      count: validRSVPs.length,
      data: validRSVPs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendees for a specific event
// @route   GET /api/events/:id/rsvps
// @access  Private (Organizer or Admin)
const getEventRSVPs = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check organizer or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only event organizers can view attendee rosters.',
      });
    }

    const rsvps = await RSVP.find({ event: event._id })
      .populate('user', 'name email avatar organization bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's RSVP status for an event
// @route   GET /api/events/:id/rsvp/status
// @access  Private
const getUserRSVPStatus = async (req, res, next) => {
  try {
    const rsvp = await RSVP.findOne({
      event: req.params.id,
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      hasRSVP: !!rsvp && rsvp.status !== 'cancelled',
      rsvp: rsvp && rsvp.status !== 'cancelled' ? rsvp : null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rsvpEvent,
  cancelRSVP,
  getMyRSVPs,
  getEventRSVPs,
  getUserRSVPStatus,
};
