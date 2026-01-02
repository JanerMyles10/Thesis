const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  shopTagline: { type: String },
  shopDescription: { type: String },
  fullName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  
  status: { type: String, default: 'Approved' }, 
  isBoosted: { type: Boolean, default: false }, 
  
  rating: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'shop' });

module.exports = mongoose.model('Shop', ShopSchema);