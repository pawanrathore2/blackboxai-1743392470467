import api from '../utils/axiosConfig';

const getAllPayments = async () => {
  const response = await api.get('/api/payments');
  return response.data;
};

const createPayment = async (paymentData) => {
  const response = await api.post('/api/payments', paymentData);
  return response.data;
};

const getPaymentById = async (id) => {
  const response = await api.get(`/api/payments/${id}`);
  return response.data;
};

export default {
  getAllPayments,
  createPayment,
  getPaymentById
};