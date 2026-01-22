const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Complete', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
