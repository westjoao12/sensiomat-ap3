import React from 'react';
import useStore from '../../store/useStore';
import { Layers, Thermometer, Cpu, Shield, Play } from 'lucide-react';

export default function Sidebar() {
  const { materials, environment, layers, setEnvironment, setLayerMaterial, runSimulation, isLoading } = useStore();

  // Mapeado diretamente do teu ficheiro environments.json para enviar o ID correto para a API
  const environments = [
    { id: 'env_body_implant', name: 'Biossensor Epidérmico / Implante' },
    { id: 'env_agri_soil', name: 'Sensor Agrícola de Subsolo (IoT)' },
    { id: 'env_industrial_hot', name: 'Monitoramento de Turbina / Industrial' },
    { id: 'env_optical_smart', name: 'Lente de Contato Inteligente' }
  ];

  const safeMaterials = Array.isArray(materials) ? materials : [];

  return (
    <div className="space-y-8 relative">
      
      {/* Ambiente de Operação */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Thermometer size={16} className="text-brandAccent" />
          Ambiente de Operação
        </label>
        <select 
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-brandAccent focus:border-brandAccent outline-none transition-all"
        >
          {/* Se nenhum ambiente estiver selecionado, usamos o primeiro da lista como padrão no valor */}
          {environments.map(env => (
            <option key={env.id} value={env.id}>{env.name}</option>
          ))}
        </select>
      </div>

      <div className="w-full h-px bg-slate-800" />

      {/* Camadas do Sensor */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Layers size={16} className="text-brandAccent" />
          Arquitetura da Pilha (Stack)
        </h3>

        {/* Encapsulamento */}
        <div className="space-y-2 p-3 rounded-lg border border-slate-800 bg-slate-800/20">
          <label className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1"><Shield size={14}/> Encapsulamento (Topo)</span>
          </label>
          <select 
            value={layers.encapsulation || ''}
            onChange={(e) => setLayerMaterial('encapsulation', e.target.value)}
            className="w-full bg-transparent border-b border-slate-700 p-1 text-sm outline-none focus:border-brandAccent text-white"
          >
            <option value="" disabled>Selecione um material...</option>
            {safeMaterials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.category})</option>)}
          </select>
        </div>

        {/* Circuito */}
        <div className="space-y-2 p-3 rounded-lg border border-slate-800 bg-slate-800/20">
          <label className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1"><Cpu size={14}/> Circuito Ativo (Meio)</span>
          </label>
          <select 
            value={layers.circuit || ''}
            onChange={(e) => setLayerMaterial('circuit', e.target.value)}
            className="w-full bg-transparent border-b border-slate-700 p-1 text-sm outline-none focus:border-brandAccent text-white"
          >
            <option value="" disabled>Selecione um material...</option>
            {safeMaterials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.category})</option>)}
          </select>
        </div>

        {/* Substrato */}
        <div className="space-y-2 p-3 rounded-lg border border-slate-800 bg-slate-800/20">
          <label className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1"><Layers size={14}/> Substrato (Base)</span>
          </label>
          <select 
            value={layers.substrate || ''}
            onChange={(e) => setLayerMaterial('substrate', e.target.value)}
            className="w-full bg-transparent border-b border-slate-700 p-1 text-sm outline-none focus:border-brandAccent text-white"
          >
            <option value="" disabled>Selecione um material...</option>
            {safeMaterials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.category})</option>)}
          </select>
        </div>
      </div>

      {/* Botão de Simulação */}
      <div className="pt-4">
        <button 
          onClick={runSimulation}
          disabled={isLoading || !layers.substrate || !layers.circuit || !layers.encapsulation}
          className="w-full flex items-center justify-center gap-2 bg-brandAccent hover:bg-sky-400 text-darkBg font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
             <span className="animate-pulse">A calcular física...</span>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              Executar Simulação
            </>
          )}
        </button>
      </div>

    </div>
  );
}