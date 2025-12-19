import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ChatBox.css';

const ChatBox = ({ selectedUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  useEffect(() => {
    if (selectedUser) {
      loadMessages();
    }
  }, [selectedUser]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data) => {
      if (data.senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on('user_typing', (data) => {
      setIsTyping(true);
    });

    socket.on('user_stopped_typing', () => {
      setIsTyping(false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [socket, selectedUser]);

  const loadMessages = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const response = await messageService.getMessages(selectedUser._id);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageContent = newMessage;
    setNewMessage('');

    try {
      const response = await messageService.sendMessage(selectedUser._id, messageContent);
      setMessages((prev) => [...prev, response.data]);

      // Emit via Socket.io
      if (socket) {
        socket.emit('send_message', {
          senderId: user._id,
          receiverId: selectedUser._id,
          content: messageContent,
          messageId: response.data._id,
        });

        socket.emit('stop_typing', { receiverId: selectedUser._id });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageContent); // Restore message on error
    }
  };

  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        receiverId: selectedUser._id,
        senderName: user.username,
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { receiverId: selectedUser._id });
      }, 1000);
    }
  };

  if (!selectedUser) {
    return <div className="chatbox empty-state">Select a user to start chatting</div>;
  }

  return (
    <div className="chatbox">
      <div className="chat-header">
        <img src={selectedUser.avatar} alt={selectedUser.username} className="user-avatar" />
        <div className="chat-header-info">
          <h2>{selectedUser.username}</h2>
          <p className="user-status">{selectedUser.status === 'online' ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}
            >
              <div className="message-content">{msg.content}</div>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
        {isTyping && <div className="typing-indicator">User is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
