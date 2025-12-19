import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import StatusList from '../components/StatusList';
import CallsList from '../components/CallsList';
import Settings from '../components/Settings';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('messages'); // messages, status, calls, settings
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Initialize Socket.io connection
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      if (user) {
        newSocket.emit('user_online', user._id);
      }
    });

    newSocket.on('users_online', (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="chat-page">
      <Navbar socket={socket} onlineCount={onlineUsers.length} onLogout={handleLogout} />
      <div className="chat-container">
        <div className="left-panel">
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('messages');
                setShowSettings(false);
              }}
            >
              Messages
            </button>
            <button
              className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('status');
                setShowSettings(false);
              }}
            >
              Status
            </button>
            <button
              className={`tab-button ${activeTab === 'calls' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('calls');
                setShowSettings(false);
              }}
            >
              Calls
            </button>
            <button
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('settings');
                setShowSettings(true);
              }}
            >
              Settings
            </button>
          </div>

          {activeTab === 'messages' && (
            <UserList
              onSelectUser={setSelectedUser}
              selectedUser={selectedUser}
              onlineUsers={onlineUsers}
            />
          )}
          {activeTab === 'status' && <StatusList users={onlineUsers} />}
          {activeTab === 'calls' && <CallsList onlineUsers={onlineUsers} />}
          {activeTab === 'settings' && (
            <Settings onClose={() => setActiveTab('messages')} />
          )}
        </div>

        {activeTab === 'messages' && (
          <ChatBox selectedUser={selectedUser} socket={socket} />
        )}
      </div>
    </div>
  );
};

export default Chat;
