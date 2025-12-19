import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import './CallsList.css';

const CallsList = ({ onlineUsers }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      // Mock call history - in production this would come from backend
      const usersWithCalls = response.data.map((user) => ({
        ...user,
        callTime: new Date(Date.now() - Math.random() * 86400000),
        callDuration: Math.floor(Math.random() * 3600),
        isOutgoing: Math.random() > 0.5,
      }));
      setCalls(usersWithCalls);
    } catch (error) {
      console.error('Failed to load calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="calls-list">
      <div className="calls-header">
        <h3>Call History</h3>
      </div>

      <div className="calls-container">
        {loading ? (
          <div className="loading">Loading calls...</div>
        ) : calls.length === 0 ? (
          <div className="no-calls">No calls yet</div>
        ) : (
          calls.map((call) => (
            <div key={call._id} className="call-item">
              <img src={call.avatar} alt={call.username} className="call-avatar" />
              <div className="call-info">
                <h4>{call.username}</h4>
                <div className="call-details">
                  <span className={`call-type ${call.isOutgoing ? 'outgoing' : 'incoming'}`}>
                    {call.isOutgoing ? '📞 Outgoing' : '📱 Incoming'}
                  </span>
                  <span className="call-time">{formatTime(call.callTime)}</span>
                </div>
                <p className="call-duration">{formatDuration(call.callDuration)}</p>
              </div>
              <div className="call-action">
                <button className="call-button" title="Call">
                  📞
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallsList;
