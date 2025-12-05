// routes/shopRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const ShopApplication = require('../model/ShopApplication'); // Import the model we just created

// --- FILE UPLOAD SETUP (MULTER) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure you have an 'uploads' folder in your project root
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwriting files
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- DEFINE THE POST ROUTE ---
// This will handle POST requests to '/api/shop-applications' (the prefix is set in server.js)
router.post('/', upload.single('nationalId'), async (req, res) => {
  console.log('Received new shop application data:', req.body);
  if (!req.file) {
    return res.status(400).json({ message: 'National ID file is required.' });
  }

  const newApplication = new ShopApplication({
    userId: req.body.userId,
    shopName: req.body.shopName,
    shopTagline: req.body.shopTagline,
    shopDescription: req.body.shopDescription,
    fullName: req.body.fullName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    nationalIdFilename: req.file.filename
  });

  try {
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error saving application', error: error });
  }
});

module.exports = router;