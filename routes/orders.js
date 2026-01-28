const express = require('express');
const router = express.Router();
const Order = require('../model/orders');

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save order' });
  }
});

// GET orders for a specific seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.sellerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/count/:sellerId', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({
      sellerId: req.params.sellerId
    });

    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to count orders' });
  }
});


module.exports = router;
