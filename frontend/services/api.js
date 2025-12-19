import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
};

export const messageService = {
  getMessages: (receiverId) => api.get(`/messages/${receiverId}`),
  sendMessage: (receiverId, content) =>
    api.post('/messages', { receiverId, content }),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
};

export default api;
