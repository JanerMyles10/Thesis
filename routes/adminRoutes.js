const express = require('express');
const router = express.Router();
const User = require('../model/User');
const ShopApplication = require('../model/ShopApplication');

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

    res.json({ message: 'Application approved and user promoted to seller', application });
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

module.exports = router;