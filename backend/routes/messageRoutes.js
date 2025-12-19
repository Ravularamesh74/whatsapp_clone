const express = require('express');
const { getMessages, sendMessage, markAsRead } = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:receiverId', auth, getMessages);
router.post('/', auth, sendMessage);
router.put('/:messageId/read', auth, markAsRead);

module.exports = router;
