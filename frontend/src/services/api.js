import axios from 'axios';

// Aponta para o backend local que configuramos anteriormente
const API_URL = 'http://localhost:3001/api';

export const fetchMaterials = async () => {
  const response = await axios.get(`${API_URL}/materials`);
  return response.data;
};

export const simulateStack = async (environment, layers) => {
  const response = await axios.post(`${API_URL}/simulate`, {
    environment,
    layers
  });
  return response.data;
};