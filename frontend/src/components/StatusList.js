import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import './StatusList.css';

const StatusList = ({ users }) => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      // Mock status data - in production this would come from backend
      const usersWithStatus = response.data.map((user) => ({
        ...user,
        lastStatusUpdate: new Date(Date.now() - Math.random() * 3600000),
        statusText: `Last seen just now`,
      }));
      setStatuses(usersWithStatus);
    } catch (error) {
      console.error('Failed to load statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="status-list">
      <div className="status-header">
        <h3>Status Updates</h3>
      </div>

      <div className="statuses-container">
        {loading ? (
          <div className="loading">Loading statuses...</div>
        ) : statuses.length === 0 ? (
          <div className="no-statuses">No statuses yet</div>
        ) : (
          statuses.map((status) => (
            <div key={status._id} className="status-item">
              <div className="status-avatar-wrapper">
                <img src={status.avatar} alt={status.username} className="status-avatar" />
                <div className="status-indicator"></div>
              </div>
              <div className="status-info">
                <h4>{status.username}</h4>
                <p>{formatTime(status.lastStatusUpdate)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatusList;
