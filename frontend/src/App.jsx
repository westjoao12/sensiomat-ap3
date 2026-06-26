import React, { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar/Sidebar';
import CanvasView from './components/Canvas3D/CanvasView';
import Report from './components/Report/Report';

export default function App() {
  const { loadMaterials, theme } = useStore();
  
  // Estados locais para controlar a abertura dos menus em dispositivos móveis
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  // Gestão do Dark Mode na raiz do documento
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
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-300 relative">
      
      {/* Fundo Escuro Opaco (Backdrop) - Aparece apenas no mobile se algum menu estiver aberto */}
      {(isSidebarOpen || isReportOpen) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsReportOpen(false);
          }}
        />
      )}

      {/* PAINEL ESQUERDO: Configurações & Arquitetura */}
      <div className={`
        fixed inset-y-0 left-0 w-80 h-full bg-white dark:bg-darkSurface border-r border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Botão para fechar o menu no Mobile */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 md:hidden">
          <span className="font-bold text-slate-700 dark:text-slate-300">Configurações</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* CENTRO: Viewport 3D */}
      <div className="flex-1 relative h-full w-full">
        
        {/* BARRA DE BOTÕES FLUTUANTES (Apenas visível em Telas Móveis / md:hidden) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center md:hidden pointer-events-none">
          {/* Gatilho Menu Esquerdo */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white dark:bg-darkSurface rounded-xl shadow-xl text-slate-700 dark:text-slate-200 pointer-events-auto active:scale-95 transition-all border border-slate-200/50 dark:border-slate-700/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Gatilho Menu Direito (Diagnóstico) */}
          <button 
            onClick={() => setIsReportOpen(true)}
            className="p-3 bg-white dark:bg-darkSurface rounded-xl shadow-xl text-slate-700 dark:text-slate-200 pointer-events-auto active:scale-95 transition-all border border-slate-200/50 dark:border-slate-700/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>

        {/* Componente Gráfico 3D */}
        <CanvasView />
        
        {/* Título do Ambiente (Reposicionado dinamicamente para não colidir com os botões) */}
        <div className="absolute top-20 md:top-6 left-6 pointer-events-none">
          <h2 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest drop-shadow-md">
            Ambiente de Simulação
          </h2>
        </div>
      </div>

      {/* PAINEL DIREITO: Diagnóstico SensiMat */}
      <div className={`
        fixed inset-y-0 right-0 w-85 max-w-[calc(100vw-3rem)] h-full bg-white dark:bg-darkSurface shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isReportOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Botão para fechar o menu de Diagnóstico no Mobile */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 md:hidden">
          <button 
            onClick={() => setIsReportOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-bold text-slate-700 dark:text-slate-300">Resultados</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Report />
        </div>
      </div>
      
    </div>
  );
}