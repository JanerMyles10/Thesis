// routes/shopRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const ShopApplication = require('../model/ShopApplication');
// 👇 IMPORTANT: We need the User model to find the userId from the email
const User = require('../model/User'); 

// --- FILE UPLOAD SETUP (MULTER) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// 1. CREATE SHOP APPLICATION
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
    nationalIdFilename: req.file.filename,
    status: 'Pending' // Ensure status is set to Pending initially
  });

  try {
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error saving application', error: error });
  }
});

// 👇 2. NEW ROUTE: CHECK STATUS BY EMAIL 👇
// This fixes the 404 error in your console
router.get('/status/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // A. Find the User ID using the email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // B. Find the Shop Application using the User ID
    const application = await ShopApplication.findOne({ userId: user._id });

    if (!application) {
      // User hasn't applied yet
      return res.json({ status: 'None', role: user.role });
    }

    // C. Return the status (Pending, Approved, etc.)
    res.json({ 
      status: application.status,
      role: user.role 
    });

  } catch (error) {
    console.error("Error checking shop status:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;