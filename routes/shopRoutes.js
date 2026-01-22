const express = require('express');
const router = express.Router();
const multer = require('multer');
const ShopApplication = require('../model/ShopApplication');
const User = require('../model/User'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


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
    status: 'Pending'
  });

  try {
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error saving application', error: error });
  }
});
router.get('/status/:email', async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const application = await ShopApplication.findOne({ userId: user._id });

    if (!application) {
      return res.json({ status: 'None', role: user.role });
    }

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