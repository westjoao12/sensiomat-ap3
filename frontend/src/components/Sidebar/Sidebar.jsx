import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Layers, Thermometer, Cpu, Shield, Play, GripVertical, Trash2 } from 'lucide-react';

export default function Sidebar() {
  const { materials, environment, layers, setEnvironment, setLayerMaterial, runSimulation, isLoading } = useStore();
  const [activeDragLayer, setActiveDragLayer] = useState(null); // Estado para animar a zona de drop

  const environments = [
    { id: 'env_body_implant', name: 'Biossensor Epidérmico / Implante' },
    { id: 'env_agri_soil', name: 'Sensor Agrícola de Subsolo (IoT)' },
    { id: 'env_industrial_hot', name: 'Monitoramento de Turbina / Industrial' },
    { id: 'env_optical_smart', name: 'Lente de Contato Inteligente' }
  ];

  const safeMaterials = Array.isArray(materials) ? materials : [];

  // --- FUNÇÕES DE DRAG AND DROP ---
  
  // Quando o utilizador começa a arrastar um material do catálogo
  const handleDragStart = (e, materialId) => {
    e.dataTransfer.setData('materialId', materialId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Permite que a zona aceite o drop (necessário no HTML5)
  const handleDragOver = (e, layerName) => {
    e.preventDefault();
    if (activeDragLayer !== layerName) {
      setActiveDragLayer(layerName);
    }
  };

  const handleDragLeave = () => {
    setActiveDragLayer(null);
  };

  // Quando o material é solto na zona
  const handleDrop = (e, layerName) => {
    e.preventDefault();
    setActiveDragLayer(null);
    const materialId = e.dataTransfer.getData('materialId');
    if (materialId) {
      setLayerMaterial(layerName, materialId);
    }
  };

  const removeMaterial = (layerName) => {
    setLayerMaterial(layerName, null);
  };

  // Helper visual para dar uma cor indicativa a cada material no catálogo
  const getMaterialDotColor = (id) => {
    if (!id) return 'bg-slate-700';
    if (id.includes('cu_')) return 'bg-orange-500';
    if (id.includes('au_')) return 'bg-yellow-400';
    if (id.includes('steel')) return 'bg-slate-400';
    if (id.includes('alumina')) return 'bg-white';
    if (id.includes('pdms')) return 'bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.5)]';
    if (id.includes('si_')) return 'bg-emerald-600';
    if (id.includes('graphene')) return 'bg-slate-900 border border-slate-500';
    if (id.includes('mos2')) return 'bg-purple-500';
    return 'bg-brandAccent';
  };

  // Componente visual da Zona de Drop (Slot)
  const DropZone = ({ layerName, label, icon: Icon, currentMaterialId }) => {
    const isDraggingOver = activeDragLayer === layerName;
    const material = safeMaterials.find(m => m.id === currentMaterialId);

    return (
      <div className="space-y-1.5">
        <label className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
          <Icon size={14} className="text-brandAccent" /> {label}
        </label>
        
        <div 
          onDragOver={(e) => handleDragOver(e, layerName)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, layerName)}
          className={`
            relative flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
            ${isDraggingOver ? 'border-brandAccent bg-brandAccent/10 scale-[1.02]' : 'border-dashed border-slate-700 bg-slate-800/30'}
            ${material ? 'border-solid border-slate-600 bg-slate-800/80 shadow-inner' : 'hover:border-slate-500'}
          `}
        >
          {material ? (
            // Estado: Preenchido
            <div className="flex items-center gap-3 w-full">
              <div className={`w-3 h-3 rounded-full shrink-0 ${getMaterialDotColor(material.id)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{material.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{material.category}</p>
              </div>
              <button 
                onClick={() => removeMaterial(layerName)}
                className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-colors"
                title="Remover material"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            // Estado: Vazio
            <div className="flex items-center justify-center w-full py-2 pointer-events-none">
              <span className={`text-xs font-medium ${isDraggingOver ? 'text-brandAccent' : 'text-slate-500'}`}>
                {isDraggingOver ? 'Solte para equipar' : 'Arraste um material aqui'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6 relative pb-6">
      
      {/* 1. CONFIGURAÇÃO DE AMBIENTE */}
      <div className="space-y-3 shrink-0">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Thermometer size={16} className="text-brandAccent" />
          Ambiente de Operação
        </label>
        <select 
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-md p-2.5 text-sm focus:ring-1 focus:ring-brandAccent outline-none transition-all shadow-inner"
          style={{ colorScheme: 'dark' }}
        >
          {environments.map(env => (
            <option key={env.id} value={env.id} className="bg-slate-900">{env.name}</option>
          ))}
        </select>
      </div>

      <div className="w-full h-px bg-slate-800 shrink-0" />

      {/* 2. ZONAS DE DROP (Slots do Sensor) */}
      <div className="space-y-4 shrink-0">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
          <Layers size={16} className="text-brandAccent" />
          Slots de Arquitetura
        </h3>

        <DropZone layerName="encapsulation" label="Encapsulamento (Topo)" icon={Shield} currentMaterialId={layers.encapsulation} />
        <DropZone layerName="circuit" label="Circuito Ativo (Meio)" icon={Cpu} currentMaterialId={layers.circuit} />
        <DropZone layerName="substrate" label="Substrato (Base)" icon={Layers} currentMaterialId={layers.substrate} />
      </div>

      <div className="w-full h-px bg-slate-800 shrink-0" />

      {/* 3. CATÁLOGO DE MATERIAIS (Inventário Arrastável) */}
      <div className="flex-1 min-h-[200px] flex flex-col">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
          <span>Inventário de Materiais</span>
          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">Arraste os itens</span>
        </h3>
        
        {/* Lista com scroll para os materiais */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {safeMaterials.map(m => (
            <div 
              key={m.id}
              draggable
              onDragStart={(e) => handleDragStart(e, m.id)}
              className="flex items-center gap-3 p-2.5 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 hover:border-brandAccent/50 rounded cursor-grab active:cursor-grabbing transition-all group"
            >
              <GripVertical size={14} className="text-slate-500 group-hover:text-slate-300 shrink-0" />
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getMaterialDotColor(m.id)}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{m.name}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">{m.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. BOTÃO DE SIMULAÇÃO */}
      <div className="pt-2 shrink-0">
        <button 
          onClick={runSimulation}
          disabled={isLoading || !layers.substrate || !layers.circuit || !layers.encapsulation}
          className="w-full flex items-center justify-center gap-2 bg-brandAccent hover:bg-sky-400 text-darkBg font-bold py-3.5 px-4 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-brandAccent disabled:cursor-not-allowed shadow-[0_0_15px_rgba(56,189,248,0.2)]"
        >
          {isLoading ? (
             <span className="animate-pulse flex items-center gap-2">A processar heurística...</span>
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