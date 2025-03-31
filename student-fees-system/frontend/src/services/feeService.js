import api from '../utils/axiosConfig';

const getAllFees = async (queryParams = {}) => {
  const response = await api.get('/api/fees', { params: queryParams });
  return response.data;
};

const createFee = async (feeData) => {
  const response = await api.post('/api/fees', feeData);
  return response.data;
};

const updateFee = async (id, feeData) => {
  const response = await api.put(`/api/fees/${id}`, feeData);
  return response.data;
};

const deleteFee = async (id) => {
  const response = await api.delete(`/api/fees/${id}`);
  return response.data;
};

export default {
  getAllFees,
  createFee,
  updateFee,
  deleteFee
};