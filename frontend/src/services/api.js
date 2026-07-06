import axios from 'axios';

//const API_URL = 'http://localhost:3001/api/v1';
//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
// Se estiver em produção, usa o caminho relativo. Se for local, usa o localhost.
const API_URL = import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1';

export const fetchMaterials = async () => {
  try {
    const response = await axios.get(`${API_URL}/catalog`);
    const responseData = response.data;
    
    if (responseData && responseData.data && Array.isArray(responseData.data.materials)) {
      return responseData.data.materials;
    }
    
    return [];
  } catch (error) {
    console.error("Erro ao buscar catálogo:", error);
    throw error;
  }
};

export const simulateStack = async (environment, layers) => {
  const response = await axios.post(`${API_URL}/simulate`, {
    environmentId: environment,
    stack: layers
  });
  
  // CORREÇÃO: Extraímos diretamente o objeto de simulação que o teu Controller gerou
  if (response.data && response.data.simulation) {
    return response.data.simulation;
  }
  
  return response.data;
};