const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sellerId: String,
  buyerName: String,

  productName: String,
  quantity: Number,
  total: Number,

  status: { type: String, default: 'Completed' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
