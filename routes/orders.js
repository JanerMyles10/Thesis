const express = require('express');
const router = express.Router();
const Order = require('../model/orders');

router.get('/seller', async (req, res) => {
  try {
    const ownerId = req.query.ownerId; // <-- match your Shop.ownerId
    if (!ownerId) return res.status(400).send('ownerId is required');

    const orders = await Order.find({ ownerId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, ownerId } = req.body; // pass ownerId from frontend or get from auth
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).send('Order not found');

    // 🔒 Security check: only the owner can update their orders
    if (order.ownerId.toString() !== ownerId) {
      return res.status(403).send('You are not allowed to update this order');
    }

    order.status = status; // "Complete" or "Cancelled"
    await order.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/count/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;

    const totalOrders = await Order.countDocuments({
      ownerId: sellerId   // IMPORTANT: same field used in Orders
    });

    res.json({ totalOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to count orders' });
  }
});