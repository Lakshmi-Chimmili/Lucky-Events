const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['attending', 'waitlist', 'cancelled'],
      default: 'attending',
    },
    guestCount: {
      type: Number,
      default: 1,
      min: [1, 'Guest count must be at least 1'],
      max: [10, 'Guest count cannot exceed 10'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [250, 'Notes cannot exceed 250 characters'],
    },
    ticketCode: {
      type: String,
      default: () => 'TKT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate RSVP per user per event
rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
