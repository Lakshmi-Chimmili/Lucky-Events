const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Technology',
        'Business',
        'Design',
        'Marketing',
        'Networking',
        'Health & Wellness',
        'Entertainment',
        'Education',
        'Other',
      ],
      default: 'Technology',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide the event start date and time'],
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
      default: '',
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location or venue name'],
      trim: true,
    },
    virtualMeetingUrl: {
      type: String,
      default: '',
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify the maximum attendee capacity'],
      min: [1, 'Capacity must be at least 1'],
      default: 100,
    },
    ticketType: {
      type: String,
      enum: ['Free', 'Paid'],
      default: 'Free',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['published', 'draft', 'cancelled', 'completed'],
      default: 'published',
    },
    rsvpCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    remindersSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.capacity - this.rsvpCount);
});

// Virtual for isSoldOut
eventSchema.virtual('isSoldOut').get(function () {
  return this.rsvpCount >= this.capacity;
});

// Indexes for high performance searching and filtering
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ category: 1, startDate: 1, status: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
