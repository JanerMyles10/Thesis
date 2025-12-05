const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  quantity: { type: Number, required: true, default: 1 }
});

const cartUserSchema = new mongoose.Schema({
    userId: { type: string, required: true,},
    items: [cartItemSchema]
});