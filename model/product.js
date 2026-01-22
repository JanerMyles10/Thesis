const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Needed for Shop Name lookup
  
  // ✅ ADD THIS FOR REVIEWS
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);