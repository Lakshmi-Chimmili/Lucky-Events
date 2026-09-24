const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    },
    pricingType: {
      type: String,
      enum: ['flat', 'perAttendee'],
      required: [true, 'Please specify pricing type (flat or perAttendee)'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify service price in ₹'],
      min: [0, 'Service price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
