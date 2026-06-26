import { create } from 'zustand';
import { fetchMaterials, simulateStack } from '../services/api.js';

const useStore = create((set, get) => ({
  materials: [],
  environment: 'Wearable (Flexível)',
  layers: {
    substrate: null,
    circuit: null,
    encapsulation: null
  },
  simulationResult: null,
  isLoading: false,
  error: null,

  // Ação para carregar o catálogo do backend
  loadMaterials: async () => {
    try {
      const data = await fetchMaterials();
      set({ materials: data, error: null });
    } catch (error) {
      set({ error: 'Falha de comunicação com o Motor SensioMat.' });
    }
  },

  // Ação para alterar o ambiente de teste
  setEnvironment: (env) => set({ environment: env, simulationResult: null }),

  // Ação para atribuir um material a uma camada específica
  setLayerMaterial: (layerName, materialId) => set((state) => ({
    layers: {
      ...state.layers,
      [layerName]: materialId
    },
    simulationResult: null // Reseta resultados anteriores ao modificar o design
  })),

  // Ação para executar a simulação heurística
  runSimulation: async () => {
    const { environment, layers } = get();
    
    if (!layers.substrate || !layers.circuit || !layers.encapsulation) {
      set({ error: 'Erro de Arquitetura: Preencha as 3 camadas do sensor antes de simular.' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await simulateStack(environment, layers);
      set({ simulationResult: result, isLoading: false });
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Erro interno ao processar heurística.';
      set({ error: errMsg, isLoading: false });
    }
  }
}));

export default useStore;