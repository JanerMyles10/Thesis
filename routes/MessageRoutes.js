const express = require('express');
const router = express.Router();
const Message = require('../model/Message');

// 1. SEND MESSAGE
router.post('/send', async (req, res) => {
  try {
    const { 
      senderId, 
      senderName, 
      receiverId, 
      productId, 
      productName, 
      productImage, 
      messageBody, 
      shopName,
      // 🔥 NEW: Order proposal fields
      isOrderProposal,
      proposedQuantity,
      proposedPrice
    } = req.body;

    const newMessage = new Message({
      senderId,
      senderName,
      receiverId,
      productId,
      productName,
      productImage,
      messageBody,
      shopName,
      isRead: false,
      // 🔥 NEW: Order proposal data
      isOrderProposal: isOrderProposal || false,
      proposedQuantity: proposedQuantity || null,
      proposedPrice: proposedPrice || null
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET CONVERSATIONS
router.get('/my-conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET CHAT HISTORY
router.get('/chat/:userId/:otherId', async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET UNREAD COUNT
router.get('/unread-count/:userId', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.params.userId,
      isRead: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. MARK AS READ
router.put('/mark-read/:userId/:otherId', async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    await Message.updateMany(
      { senderId: otherId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;