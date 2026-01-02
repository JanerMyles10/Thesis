const express = require('express');
const router = express.Router();
const Message = require('../model/Message');

// 1. SEND MESSAGE
router.post('/send', async (req, res) => {
  try {
    const { senderId, senderName, receiverId, productId, productName, productImage, messageBody, shopName } = req.body;

    const newMessage = new Message({
      senderId,
      senderName,
      receiverId,
      productId,
      productName,
      productImage,
      messageBody,
      shopName,
      isRead: false // Default to unread
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

// 4. 🔥 GET UNREAD COUNT (This was missing!)
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

// 5. 🔥 MARK AS READ (This was missing!)
router.put('/mark-read/:userId/:otherId', async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    // Mark all messages sent BY the other person TO me as read
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