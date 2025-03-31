import api from '../utils/axiosConfig';

// Get admin dashboard statistics
const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

// Get student dashboard data
const getStudentDashboard = async (studentId) => {
  const response = await api.get(`/api/dashboard/student/${studentId}`);
  return response.data;
};

export default {
  getDashboardStats,
  getStudentDashboard
};
