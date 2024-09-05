const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    book: {
      id: {type: String,required: true},
      title: { type: String, required: true },
      author: { type: String, required: true },
      price: { type: Number, required: true },
      // Add more fields from the book as needed
    },
    status: {
      type: String,
      default: 'Order Placed',
      enum: ['Order Placed', 'Out for delivery', 'Delivered', 'Canceled'],
    },
    paymentMethod: {
      type: String,
      enum: ['Online', 'COD'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', orderSchema);