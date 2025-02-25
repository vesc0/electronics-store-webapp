const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  name: String,
  address: String,
  email: String,
  phone: String,
  totalAmount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ['awaiting', 'payed', 'failed'],
    default: 'awaiting',
  },
  deliveryStatus: {
    type: String,
    enum: ['processing', 'delivered', 'canceled'],
    default: 'processing',
  },
});

module.exports = mongoose.model('Order', orderSchema);