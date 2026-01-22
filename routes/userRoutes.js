const express = require('express');
const router = express.Router();
const User = require('../model/User'); // Check if your folder is 'model' or 'models'
const multer = require('multer');
const path = require('path');

// --- 1. SETUP IMAGE UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure you create an 'uploads' folder in your backend root
  },
  filename: function (req, file, cb) {
    // Saves file as: timestamp-filename.jpg
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// --- 2. GET PROFILE ---
router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      fullName: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      bio: user.bio,
      profilePicUrl: user.profilePicUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// --- 3. UPDATE PROFILE ---
router.put('/update', upload.single('profilePic'), async (req, res) => {
  try {
    const { email, fullName, phoneNumber, address, bio } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update text fields
    user.name = fullName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.bio = bio;

    // Update image if uploaded
    if (req.file) {
        // Build the URL based on server address
        const protocol = req.protocol;
        const host = req.get('host');
        user.profilePicUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;