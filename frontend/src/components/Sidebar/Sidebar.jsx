import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Layers, Thermometer, Cpu, Shield, Play, GripVertical, Trash2, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const { materials, environment, layers, setEnvironment, setLayerMaterial, runSimulation, isLoading, theme, toggleTheme } = useStore();
  const [activeDragLayer, setActiveDragLayer] = useState(null);
  const [selectedMobileMaterial, setSelectedMobileMaterial] = useState(null);

  // Mapeamento dos ambientes usando as chaves de tradução
  const environments = [
    { id: 'env_body_implant', nameKey: 'env_body_implant' },
    { id: 'env_agri_soil', nameKey: 'env_agri_soil' },
    { id: 'env_industrial_hot', nameKey: 'env_industrial_hot' },
    { id: 'env_optical_smart', nameKey: 'env_optical_smart' }
  ];

  const safeMaterials = Array.isArray(materials) ? materials : [];

  // NOVO: Função segura para mapear categorias com acentos para as chaves do dicionário
  const getCategoryKey = (category) => {
    const map = {
      'Metal': 'cat_metal',
      'Cerâmica': 'cat_ceramic',
      'Polímero': 'cat_polymer',
      'Semicondutor': 'cat_semiconductor',
      'Material 2D': 'cat_2d'
    };
    return map[category] || 'cat_metal';
  };

  const handleDragStart = (e, materialId) => { e.dataTransfer.setData('materialId', materialId); e.dataTransfer.effectAllowed = 'copy'; };
  const handleDragOver = (e, layerName) => { e.preventDefault(); if (activeDragLayer !== layerName) setActiveDragLayer(layerName); };
  const handleDragLeave = () => setActiveDragLayer(null);
  const handleDrop = (e, layerName) => { e.preventDefault(); setActiveDragLayer(null); const materialId = e.dataTransfer.getData('materialId'); if (materialId) setLayerMaterial(layerName, materialId); };
  const removeMaterial = (layerName) => setLayerMaterial(layerName, null);

  const getMaterialDotColor = (id) => { 
    if (!id) return 'bg-slate-400 dark:bg-slate-700';
    if (id.includes('cu_')) return 'bg-orange-500';
    if (id.includes('au_')) return 'bg-yellow-400';
    if (id.includes('steel')) return 'bg-slate-400';
    if (id.includes('alumina')) return 'bg-slate-200 dark:bg-white border border-slate-300 dark:border-none';
    if (id.includes('pdms')) return 'bg-cyan-400 dark:bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.5)]';
    if (id.includes('si_')) return 'bg-emerald-500 dark:bg-emerald-600';
    if (id.includes('graphene')) return 'bg-slate-800 dark:bg-slate-900 border border-slate-500';
    if (id.includes('mos2')) return 'bg-purple-500';
    return 'bg-brandAccent';
  };

  const DropZone = ({ layerName, label, icon: Icon, currentMaterialId }) => {
    const isDraggingOver = activeDragLayer === layerName;
    const material = safeMaterials.find(m => m.id === currentMaterialId);

    const handleZoneClick = () => { if (selectedMobileMaterial) { setLayerMaterial(layerName, selectedMobileMaterial); setSelectedMobileMaterial(null); } };

    return (
      <div className="space-y-1.5 px-6">
        <label className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 gap-1.5">
          <Icon size={14} className="text-brandAccent" /> {label}
        </label>
        <div onClick={handleZoneClick} onDragOver={(e) => handleDragOver(e, layerName)} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, layerName)}
          className={`relative flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${isDraggingOver ? 'border-brandAccent bg-brandAccent/10 scale-[1.02]' : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30'} ${material ? 'border-solid border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800/80 shadow-sm dark:shadow-inner' : 'hover:border-slate-400 dark:hover:border-slate-500'} ${selectedMobileMaterial && !material ? 'border-brandAccent/60 bg-brandAccent/5 cursor-pointer ring-2 ring-brandAccent/20' : ''}`}
        >
          {material ? (
            <div className="flex items-center gap-3 w-full">
              <div className={`w-3 h-3 rounded-full shrink-0 ${getMaterialDotColor(material.id)}`} />
              <div className="flex-1 min-w-0">
                <p translate="no" className="text-sm font-bold text-slate-800 dark:text-white truncate">{material.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t(getCategoryKey(material.category))}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeMaterial(layerName); }} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors z-10 relative"><Trash2 size={14} /></button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full py-2 pointer-events-none">
              <span className={`text-xs font-medium ${isDraggingOver || selectedMobileMaterial ? 'text-brandAccent' : 'text-slate-400 dark:text-slate-500'}`}>
                {selectedMobileMaterial ? t('slot_empty_touch') : (isDraggingOver ? t('slot_drop') : t('slot_idle'))}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative pb-6">
      
      {/* HEADER COM BANDEIRAS DE IDIOMA */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-transparent mb-6 transition-colors duration-300 gap-4">
        
        {/* BLOCO DO LOGO E TÍTULO */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 flex items-center justify-center shrink-0">
            <img src="/sensiomaticon.svg" alt="Logo SensioMat" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
          <div className="min-w-0">
            <h1 translate="no" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {t('app_title')}
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {t('app_subtitle')}
            </p>
          </div>
        </div>
        
        {/* CONTROLES (IDIOMA E TEMA) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => i18n.changeLanguage('pt')} 
            className={`w-5 h-3.5 md:w-6 md:h-4 rounded-sm overflow-hidden shadow-sm hover:scale-110 transition-all ${i18n.language === 'pt' ? 'opacity-100 ring-2 ring-brandAccent ring-offset-2 dark:ring-offset-slate-900' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`} 
            title="Português (Angola)"
          >
            <img src="https://flagcdn.com/w40/ao.png" alt="Bandeira de Angola" className="w-full h-full object-cover" />
          </button>
          
          <button 
            onClick={() => i18n.changeLanguage('en')} 
            className={`w-5 h-3.5 md:w-6 md:h-4 rounded-sm overflow-hidden shadow-sm hover:scale-110 transition-all ${i18n.language === 'en' ? 'opacity-100 ring-2 ring-brandAccent ring-offset-2 dark:ring-offset-slate-900' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`} 
            title="English"
          >
            <img src="https://flagcdn.com/w40/us.png" alt="Bandeira dos EUA" className="w-full h-full object-cover" />
          </button>
          
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          
          <button onClick={toggleTheme} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* AMBIENTE */}
      <div className="space-y-3 shrink-0 px-6 mb-6">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <Thermometer size={16} className="text-brandAccent" /> {t('env_label')}
        </label>
        <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm focus:ring-1 focus:ring-brandAccent outline-none shadow-sm">
          {environments.map(env => (
            <option key={env.id} value={env.id} className="bg-white dark:bg-slate-900">{t(env.nameKey)}</option>
          ))}
        </select>
      </div>

      <div className="w-full h-px bg-slate-200 dark:bg-slate-800 shrink-0 mb-6" />

      {/* SLOTS */}
      <div className="space-y-4 shrink-0 mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 px-6">
          <Layers size={16} className="text-brandAccent" /> {t('slots_label')}
        </h3>
        <DropZone layerName="encapsulation" label={t('layer_top')} icon={Shield} currentMaterialId={layers.encapsulation} />
        <DropZone layerName="circuit" label={t('layer_mid')} icon={Cpu} currentMaterialId={layers.circuit} />
        <DropZone layerName="substrate" label={t('layer_base')} icon={Layers} currentMaterialId={layers.substrate} />
      </div>

      <div className="w-full h-px bg-slate-200 dark:bg-slate-800 shrink-0 mb-6" />

      {/* INVENTÁRIO */}
      <div className="flex-1 min-h-[200px] flex flex-col px-6">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
          <span>{t('inventory_title')}</span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-medium text-slate-500 dark:text-slate-400">{t('drag_hint')}</span>
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {safeMaterials.map(m => {
            const isSelected = selectedMobileMaterial === m.id;
            return (
              <div key={m.id} draggable onDragStart={(e) => handleDragStart(e, m.id)} onClick={() => setSelectedMobileMaterial(isSelected ? null : m.id)}
                className={`flex items-center gap-3 p-2.5 rounded cursor-grab active:cursor-grabbing transition-all shadow-sm group ${isSelected ? 'bg-brandAccent/10 border-2 border-brandAccent dark:bg-brandAccent/20 scale-[1.02]' : 'bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/50 hover:border-brandAccent/50'}`}
              >
                <GripVertical size={14} className={`${isSelected ? 'text-brandAccent' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} shrink-0`} />
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getMaterialDotColor(m.id)}`} />
                <div className="min-w-0 pointer-events-none">
                  <p translate="no" className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-medium tracking-wide">{t(getCategoryKey(m.category))}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTÃO SIMULAR */}
      <div className="pt-4 px-6 shrink-0 mt-auto">
        <button onClick={runSimulation} disabled={isLoading || !layers.substrate || !layers.circuit || !layers.encapsulation}
          className="w-full flex items-center justify-center gap-2 bg-brandAccent hover:bg-sky-400 text-white dark:text-darkBg font-bold py-3.5 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brandAccent/30"
        >
          {isLoading ? ( <span className="animate-pulse flex items-center gap-2">{t('btn_sim_loading')}</span> ) : ( <> <Play size={18} fill="currentColor" /> {t('btn_sim_idle')} </> )}
        </button>
      </div>
    </div>
  );
}