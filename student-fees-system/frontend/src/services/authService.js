import api from '../utils/axiosConfig';

const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export default {
  login,
  register,
  getCurrentUser
};