import React, { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar/Sidebar';
import CanvasView from './components/Canvas3D/CanvasView';
import Report from './components/Report/Report';

export default function App() {
  const { loadMaterials, theme } = useStore();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

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
      
      {(isSidebarOpen || isReportOpen) && !isPresentationMode && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 print:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsReportOpen(false);
          }}
        />
      )}

      {/* PAINEL ESQUERDO: Adicionado shrink-0 para não ser esmagado */}
      <div className={`
        fixed inset-y-0 left-0 w-80 shrink-0 h-full bg-white dark:bg-darkSurface border-r border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out print:hidden
        md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isPresentationMode ? 'md:hidden' : 'md:flex'}
      `}>
        <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 md:hidden">
          <span className="font-bold text-slate-700 dark:text-slate-300">Configurações</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* CENTRO: Viewport 3D - Removido o deslocamento negativo para manter centrado na impressão */}
      <div className="flex-1 relative h-full min-w-0 print:flex-1 print:translate-x-0">
        
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none print:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`p-3 bg-white dark:bg-darkSurface rounded-xl shadow-xl text-slate-700 dark:text-slate-200 pointer-events-auto active:scale-95 transition-all border border-slate-200/50 dark:border-slate-700/50 md:hidden ${isPresentationMode ? 'hidden' : 'block'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="flex-1"></div>

          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className="p-2 px-4 bg-brandAccent hover:bg-sky-500 text-white font-medium rounded-xl shadow-lg pointer-events-auto active:scale-95 transition-all flex items-center gap-2 mr-2 md:mr-0"
          >
            {isPresentationMode ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                <span className="hidden sm:inline">Sair do Modo Pitch</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>
                <span className="hidden sm:inline">Modo Pitch (Exportar)</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => setIsReportOpen(true)}
            className={`p-3 bg-white dark:bg-darkSurface rounded-xl shadow-xl text-slate-700 dark:text-slate-200 pointer-events-auto active:scale-95 transition-all border border-slate-200/50 dark:border-slate-700/50 md:hidden ${isPresentationMode ? 'hidden' : 'block'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
        </div>

        <CanvasView />
        
        <div className={`absolute left-6 pointer-events-none transition-all duration-500 ${isPresentationMode ? 'top-6' : 'top-20 md:top-6'} print:top-6`}>
          <h2 className="text-xs md:text-lg font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest drop-shadow-md">
            Sensiomat <span className="text-brandAccent font-medium ml-1">v1.0</span>
          </h2>
          {/* Forçamos a descrição a aparecer na impressão para contextualizar o PDF */}
          <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm ${isPresentationMode ? 'block' : 'hidden md:block'} print:block`}>
            Visão arquitetural do biossensor. Camadas separadas para análise de integração material.
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO: Report - Classes de impressão ajustadas para fixar o relatório ao lado do Canvas */}
      <div className={`
        fixed inset-y-0 right-0 w-[400px] max-w-[calc(100vw-3rem)] shrink-0 h-full bg-white dark:bg-darkSurface shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isReportOpen ? 'translate-x-0' : 'translate-x-full'}
        print:static print:translate-x-0 print:w-[380px] print:shadow-none print:border-l print:border-slate-200
      `}>
        <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 md:hidden print:hidden">
          <button 
            onClick={() => setIsReportOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-bold text-slate-700 dark:text-slate-300">Resultados</span>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden print:overflow-visible">
          <Report />
        </div>
      </div>
      
    </div>
  );
}