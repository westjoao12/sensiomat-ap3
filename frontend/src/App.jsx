import React, { useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar/Sidebar';
import CanvasView from './components/Canvas3D/CanvasView';
import Report from './components/Report/Report';

export default function App() {
  const { loadMaterials, theme } = useStore();

  // Carrega os materiais da API
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  // O SEGREDO DO DARK MODE: Injetar a classe diretamente na tag <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Painel Esquerdo: Configurações */}
      <div className="w-80 h-full bg-white dark:bg-darkSurface border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col transition-colors duration-300">
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Centro: Viewport 3D */}
      <div className="flex-1 relative">
        <CanvasView />
        <div className="absolute top-6 left-6 pointer-events-none">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest drop-shadow-md">
            Ambiente de Simulação
          </h2>
        </div>
      </div>

      {/* Painel Direito: Diagnóstico */}
      <Report />
      
    </div>
  );
}