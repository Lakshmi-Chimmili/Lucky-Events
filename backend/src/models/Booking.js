const mongoose = require('mongoose');

const addOnItemBreakdownSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    pricingType: {
      type: String,
      enum: ['flat', 'perAttendee'],
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    lineTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const priceBreakdownSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    basePricePerAttendee: {
      type: Number,
      required: true,
    },
    categoryTotal: {
      type: Number,
      required: true,
    },
    addOnsBreakdown: [addOnItemBreakdownSchema],
    addOnsTotal: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    addOns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    attendeeCount: {
      type: Number,
      required: [true, 'Please provide attendee count'],
      min: [1, 'Attendee count must be at least 1'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Please provide event date and time'],
    },
    venueAddress: {
      type: String,
      required: [true, 'Please provide venue address'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    priceBreakdown: {
      type: priceBreakdownSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'assigned', 'completed', 'cancelled'],
      default: 'pending',
    },
    assignedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ status: 1, eventDate: 1 });
bookingSchema.index({ assignedStaff: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
