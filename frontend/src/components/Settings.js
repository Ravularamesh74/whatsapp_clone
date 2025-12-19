import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={onClose}>
          ←
        </button>
        <h1>Settings</h1>
        <button className="search-button">🔍</button>
      </div>

      <div className="settings-content">
        {/* Profile Section */}
        <div className="profile-section">
          <img src={user?.avatar} alt={user?.username} className="profile-avatar" />
          <div className="profile-info">
            <h2>{user?.username}</h2>
            <p className="status-text">Online</p>
          </div>
          <div className="profile-icons">
            <button className="icon-button" title="QR Code">
              🟩
            </button>
            <button className="icon-button" title="Add">
              ➕
            </button>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="settings-menu">
          {/* Account */}
          <div className="settings-item" onClick={() => setActiveSection('account')}>
            <div className="settings-icon">🔐</div>
            <div className="settings-text">
              <h3>Account</h3>
              <p>Security notifications, change number</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Privacy */}
          <div className="settings-item" onClick={() => setActiveSection('privacy')}>
            <div className="settings-icon">🔒</div>
            <div className="settings-text">
              <h3>Privacy</h3>
              <p>Block contacts, disappearing messages</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Avatar */}
          <div className="settings-item" onClick={() => setActiveSection('avatar')}>
            <div className="settings-icon">👤</div>
            <div className="settings-text">
              <h3>Avatar</h3>
              <p>Create, edit, profile photo</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Lists */}
          <div className="settings-item" onClick={() => setActiveSection('lists')}>
            <div className="settings-icon">📋</div>
            <div className="settings-text">
              <h3>Lists</h3>
              <p>Manage people and groups</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Chats */}
          <div className="settings-item" onClick={() => setActiveSection('chats')}>
            <div className="settings-icon">💬</div>
            <div className="settings-text">
              <h3>Chats</h3>
              <p>Theme, wallpapers, chat history</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Broadcasts */}
          <div className="settings-item" onClick={() => setActiveSection('broadcasts')}>
            <div className="settings-icon">📢</div>
            <div className="settings-text">
              <h3>Broadcasts</h3>
              <p>Manage lists and send broadcasts</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Notifications */}
          <div className="settings-item" onClick={() => setActiveSection('notifications')}>
            <div className="settings-icon">🔔</div>
            <div className="settings-text">
              <h3>Notifications</h3>
              <p>Message, group & call tones</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Storage and Data */}
          <div className="settings-item" onClick={() => setActiveSection('storage')}>
            <div className="settings-icon">💾</div>
            <div className="settings-text">
              <h3>Storage and data</h3>
              <p>Network usage, auto-download</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* Accessibility */}
          <div className="settings-item" onClick={() => setActiveSection('accessibility')}>
            <div className="settings-icon">♿</div>
            <div className="settings-text">
              <h3>Accessibility</h3>
              <p>Increase contrast, animation</p>
            </div>
            <span className="arrow">›</span>
          </div>

          {/* App Language */}
          <div className="settings-item" onClick={() => setActiveSection('language')}>
            <div className="settings-icon">🌐</div>
            <div className="settings-text">
              <h3>App language</h3>
              <p>English (device's language)</p>
            </div>
            <span className="arrow">›</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
