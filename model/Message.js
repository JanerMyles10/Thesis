const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String }, 
  receiverId: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  productImage: { type: String },
  shopName: { type: String },
  messageBody: { type: String, required: true },
  
  isRead: { type: Boolean, default: false }, 
  
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);