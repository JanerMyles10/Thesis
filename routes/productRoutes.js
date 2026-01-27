const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Review = require("../model/Review"); // Ensure this model exists
const multer = require("multer");
const path = require("path");

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });

// ==================================================
// 1. GET ALL PRODUCTS (With Shop Name & Reviews)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const products = await Product.aggregate([
      // Join with Shop
      {
        $lookup: {
          from: "shop", 
          localField: "ownerId",
          foreignField: "ownerId",
          as: "shopData"
        }
      },
      { $unwind: { path: "$shopData", preserveNullAndEmptyArrays: true } },
      
      // Join with Reviews
      {
        $lookup: {
          from: "reviews",        
          localField: "_id",      
          foreignField: "productId", 
          as: "reviews"
        }
      },

      // Select Fields
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          quantity: 1,
          description: 1,
          imageUrl: 1,
          ownerId: 1,
          shopName: "$shopData.shopName",
          reviews: 1
        }
      }
    ]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================================================
// 2. ADD NEW PRODUCT
// ==================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, ownerId } = req.body;
    if (!ownerId) return res.status(400).json({ message: "Owner ID required" });

    const newProduct = new Product({
      name,
      price,
      quantity,
      description,
      ownerId, 
      imageUrl: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "" 
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==================================================
// 3. ADD REVIEW
// ==================================================
router.post("/review", async (req, res) => {
  const { productId, shopName, rating, comment, user } = req.body;
  try {
    const newReview = new Review({
      productId,
      shopName,
      user: user || "Guest",
      rating: Number(rating),
      comment,
      date: new Date()
    });
    await newReview.save();
    res.status(200).json({ message: "Review added!", review: newReview });
  } catch (err) {
    res.status(500).json({ message: "Error adding review" });
  }
});

// ==================================================
// 4. 🔥 UPDATE PRODUCT (PUT) - This was missing!
// ==================================================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields if provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (description) product.description = description;

    // Update image ONLY if a new one is uploaded
    if (req.file) {
      product.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err); // Check terminal for errors
    res.status(500).json({ message: "Error updating product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;