import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import './UserList.css';

const UserList = ({ onSelectUser, selectedUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Messages</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-users">No users found</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <img src={user.avatar} alt={user.username} className="user-item-avatar" />
              <div className="user-item-info">
                <h3>{user.username}</h3>
                <p className="user-item-status">
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </p>
              </div>
              {onlineUsers.includes(user._id) && <div className="online-indicator"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
