import axios from 'axios';

// Aponta para a versão v1 da tua API
const API_URL = 'http://localhost:3001/api/v1';

export const fetchMaterials = async () => {
  try {
    const response = await axios.get(`${API_URL}/catalog`);
    const responseData = response.data;
    
    console.log("Dados da API recebidos com sucesso!");

    // O simulationController.js envia os dados dentro de responseData.data.materials
    if (responseData && responseData.data && Array.isArray(responseData.data.materials)) {
      return responseData.data.materials;
    }
    
    // Fallback de segurança
    console.error("Estrutura não reconhecida", responseData);
    return [];
  } catch (error) {
    console.error("Erro ao buscar catálogo:", error);
    throw error;
  }
};

// As variáveis environment e layers vêm do Zustand, mas renomeamos 
// na hora de enviar para bater certo com a exigência do backend.
export const simulateStack = async (environment, layers) => {
  const response = await axios.post(`${API_URL}/simulate`, {
    environmentId: environment,
    stack: layers
  });
  return response.data;
};