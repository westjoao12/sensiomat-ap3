import React, { useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar/Sidebar';
import CanvasView from './components/Canvas3D/CanvasView';
import Report from './components/Report/Report';

export default function App() {
  const loadMaterials = useStore((state) => state.loadMaterials);

  // Carrega os materiais da API assim que a aplicação é montada
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  return (
    <div className="flex h-screen w-screen bg-darkBg text-slate-200 overflow-hidden font-sans">
      
      {/* Painel Esquerdo: Configurações */}
      <div className="w-80 h-full bg-darkSurface border-r border-slate-800 shadow-2xl z-10 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brandAccent flex items-center justify-center font-bold text-darkBg">
            SM
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SensioMat</h1>
            <p className="text-xs text-slate-400">Motor de Arquitetura IoT</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Sidebar />
        </div>
      </div>

      {/* Centro: Viewport 3D */}
      <div className="flex-1 relative">
        <CanvasView />
        <div className="absolute top-6 left-6 pointer-events-none">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Ambiente de Simulação
          </h2>
        </div>
      </div>

      {/* Painel Direito: Relatório (Sobreposto ou Fixo) */}
      <Report />
      
    </div>
  );
}