const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  imageUrl: String,
  quantity: { type: Number, default: 1 }
});

const cartUserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartUserSchema);
