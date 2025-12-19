import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ socket, onlineCount, onLogout }) => {
  const { user } = useAuth();
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    if (socket && user) {
      socket.emit('user_online', user._id);
      setOnlineStatus(true);

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, user]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">💬 WhatsApp Clone</h1>
      </div>

      <div className="navbar-center">
        <span className="online-count">🟢 {onlineCount} users online</span>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <img src={user?.avatar} alt={user?.username} className="navbar-avatar" />
          <span className="username">{user?.username}</span>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
