const Message = require('../models/Message');

// Get chat history between two users
const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();
    await message.populate('sender', 'username avatar');
    await message.populate('receiver', 'username avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, sendMessage, markAsRead };
