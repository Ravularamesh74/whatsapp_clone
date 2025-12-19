const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io events
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User comes online
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('users_online', Array.from(onlineUsers.keys()));
    console.log('Online users:', Array.from(onlineUsers.keys()));
  });

  // Send message
  socket.on('send_message', (data) => {
    const { senderId, receiverId, content, messageId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', {
        senderId,
        content,
        messageId,
        timestamp: new Date(),
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiverId, senderName } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { senderName });
    }
  });

  socket.on('stop_typing', (data) => {
    const { receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_stopped_typing');
    }
  });

  // User goes offline
  socket.on('disconnect', () => {
    let offlineUserId;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        offlineUserId = userId;
        break;
      }
    }

    if (offlineUserId) {
      onlineUsers.delete(offlineUserId);
      io.emit('users_online', Array.from(onlineUsers.keys()));
      console.log('User disconnected:', offlineUserId);
    }
  });
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
