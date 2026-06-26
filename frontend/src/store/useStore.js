import { create } from 'zustand';
import { fetchMaterials, simulateStack } from '../services/api.js';

const useStore = create((set, get) => ({
  materials: [],
  // CORREÇÃO: O estado inicial deve ser um ID real do environments.json
  environment: 'env_body_implant', 
  layers: {
    substrate: null,
    circuit: null,
    encapsulation: null
  },
  simulationResult: null,
  isLoading: false,
  error: null,

  loadMaterials: async () => {
    try {
      const data = await fetchMaterials();
      set({ materials: data, error: null });
    } catch (error) {
      set({ error: 'Falha de comunicação com o Motor SensioMat.' });
    }
  },

  setEnvironment: (env) => set({ environment: env, simulationResult: null }),

  setLayerMaterial: (layerName, materialId) => set((state) => ({
    layers: {
      ...state.layers,
      [layerName]: materialId
    },
    simulationResult: null
  })),

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
      // Se o backend devolver 404 ou 500, capturamos a mensagem correta
      const errMsg = error.response?.data?.error || 'Erro interno ao processar heurística.';
      set({ error: errMsg, isLoading: false, simulationResult: null });
    }
  }
}));

export default useStore;