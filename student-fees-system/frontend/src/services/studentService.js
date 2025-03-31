import api from '../utils/axiosConfig';

// Get student dashboard data
const getStudentDashboardData = async (studentId) => {
  const response = await api.get(`/api/students/${studentId}`);
  return response.data;
};

// Get student fee dues
const getStudentDues = async (studentId) => {
  const response = await api.get(`/api/students/${studentId}/dues`);
  return response.data;
};

// Get student payment history
const getStudentPayments = async (studentId) => {
  const response = await api.get(`/api/students/${studentId}/payments`);
  return response.data;
};

// Update student profile
const updateStudentProfile = async (studentId, profileData) => {
  const response = await api.put(`/api/students/${studentId}`, profileData);
  return response.data;
};

export default {
  getStudentDashboardData,
  getStudentDues,
  getStudentPayments,
  updateStudentProfile
};
