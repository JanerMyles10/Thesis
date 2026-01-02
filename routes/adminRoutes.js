const express = require('express');
const router = express.Router();
const User = require('../model/User');
const ShopApplication = require('../model/ShopApplication');
const Shop = require('../model/Shop'); 

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('name email role');
    res.json(users);
  } catch (error) {
    console.error("Error in /api/admin/users route:", error);
    res.status(500).json({ message: 'Error fetching users', error: error });
  }
});

router.put('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    ).select('name email role');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error });
  }
});

router.get('/shop-applications/pending', async (req, res) => {
  try {
    const applications = await ShopApplication.find({ status: 'Pending' });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});

router.get('/shop-applications/:id', async (req, res) => {
  try {
    const application = await ShopApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ message: 'Error fetching details', error });
  }
});

router.put('/shop-applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await ShopApplication.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }


    if (application.userId) {
      await User.findByIdAndUpdate(application.userId, { role: 'seller' });
    }

    const existingShop = await Shop.findOne({ ownerId: application.userId });
    
    if (!existingShop) {
      const newShop = new Shop({
        _id: application._id,
        ownerId: application.userId,
        shopName: application.shopName,
        shopTagline: application.shopTagline,
        shopDescription: application.shopDescription,
        fullName: application.fullName,
        address: application.address,
        phoneNumber: application.phoneNumber,
        status: 'Approved',
        isBoosted: false
      });
      await newShop.save();
      console.log("Shop created automatically in database.");
    }

    res.json({ message: 'Application approved, user promoted, and Shop created!', application });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: 'Error approving application', error });
  }
});

router.put('/shop-applications/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await ShopApplication.findByIdAndUpdate(
      id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application rejected', application });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: 'Error rejecting application', error });
  }
});

router.get('/shops/approved', async (req, res) => {
  try {
    const shops = await Shop.find({});
    res.json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: 'Error fetching shops', error });
  }
});

router.put('/shops/:id/boost', async (req, res) => {
  try {
    const { isBoosted } = req.body;
    await Shop.findByIdAndUpdate(req.params.id, { isBoosted });
    res.json({ message: 'Boost status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating boost status', error });
  }
});

router.put('/shops/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await Shop.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Shop status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating shop status', error });
  }
});

module.exports = router;