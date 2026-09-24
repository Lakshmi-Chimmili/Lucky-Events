const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const { sendRemindersForEvent } = require('../services/reminderScheduler');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      time,
      isVirtual,
      location,
      virtualMeetingUrl,
      capacity,
      ticketType,
      price,
      bannerImage,
      tags,
      status,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category: category || 'Technology',
      organizer: req.user.id,
      startDate,
      endDate: endDate || null,
      time: time || '',
      isVirtual: Boolean(isVirtual),
      location,
      virtualMeetingUrl: virtualMeetingUrl || '',
      capacity: Number(capacity) || 100,
      ticketType: ticketType || 'Free',
      price: ticketType === 'Paid' ? Number(price) || 0 : 0,
      bannerImage:
        bannerImage ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map((t) => t.trim()) : [],
      status: status || 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events with search, category filtering, and pagination
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const { search, category, ticketType, timeframe, sort } = req.query;

    const query = { status: 'published' };

    // Search keyword in title, description, or location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Ticket Type filter (Free/Paid)
    if (ticketType && ticketType !== 'All') {
      query.ticketType = ticketType;
    }

    // Timeframe filter (upcoming vs past)
    const now = new Date();
    if (timeframe === 'past') {
      query.startDate = { $lt: now };
    } else if (timeframe === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      query.startDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (timeframe === 'upcoming' || !timeframe) {
      query.startDate = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }; // show recent/upcoming
    }

    // Sorting
    let sortOptions = { startDate: 1 };
    if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOptions = { rsvpCount: -1 };
    } else if (sort === 'priceAsc') {
      sortOptions = { price: 1 };
    } else if (sort === 'priceDesc') {
      sortOptions = { price: -1 };
    }

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email avatar organization')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      totalEvents,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit) || 1,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured top events
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'published' })
      .populate('organizer', 'name email avatar organization')
      .sort({ featured: -1, rsvpCount: -1, startDate: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email avatar organization bio'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Get recent attendees preview (first 8)
    const recentRSVPs = await RSVP.find({ event: event._id, status: 'attending' })
      .populate('user', 'name avatar')
      .limit(8);

    // If request has authorization header, check if user has RSVP'd
    let userRSVP = null;
    if (req.user) {
      userRSVP = await RSVP.findOne({
        event: event._id,
        user: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      event,
      recentAttendees: recentRSVPs.map((r) => ({
        user: r.user,
        guestCount: r.guestCount,
        ticketCode: r.ticketCode,
      })),
      userRSVP,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event.',
      });
    }

    const {
      title,
      description,
      category,
      startDate,
      endDate,
      time,
      isVirtual,
      location,
      virtualMeetingUrl,
      capacity,
      ticketType,
      price,
      bannerImage,
      tags,
      status,
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (startDate) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;
    if (time !== undefined) event.time = time;
    if (isVirtual !== undefined) event.isVirtual = Boolean(isVirtual);
    if (location) event.location = location;
    if (virtualMeetingUrl !== undefined) event.virtualMeetingUrl = virtualMeetingUrl;
    if (capacity !== undefined) event.capacity = Number(capacity);
    if (ticketType) event.ticketType = ticketType;
    if (price !== undefined) event.price = ticketType === 'Paid' ? Number(price) : 0;
    if (bannerImage) event.bannerImage = bannerImage;
    if (tags) {
      event.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim())
        : event.tags;
    }
    if (status) event.status = status;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.',
      });
    }

    // Clean up RSVPs associated with this event
    await RSVP.deleteMany({ event: event._id });
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and associated RSVPs deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get events created by logged-in user
// @route   GET /api/events/user/my-events
// @access  Private
const getMyEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments({ organizer: req.user.id });
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      totalEvents,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit) || 1,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually trigger email reminders for an event
// @route   POST /api/events/:id/send-reminders
// @access  Private
const triggerEventReminders = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only event organizers can send reminders.',
      });
    }

    const result = await sendRemindersForEvent(event._id);

    res.status(200).json({
      success: true,
      message: `Reminders successfully dispatched to ${result.sentCount} attendee(s)!`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getFeaturedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  triggerEventReminders,
};
