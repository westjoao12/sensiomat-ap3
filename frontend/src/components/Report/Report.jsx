import React from 'react';
import useStore from '../../store/useStore';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function Report() {
  const { simulationResult, error } = useStore();

  if (!simulationResult && !error) {
    return (
      <div className="w-80 h-full bg-darkSurface border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center opacity-50 z-10">
        <Info size={32} className="text-slate-500 mb-4" />
        <p className="text-sm text-slate-400">Configure a arquitetura de materiais e execute a simulação para gerar o diagnóstico termodinâmico e estrutural.</p>
      </div>
    );
  }

  return (
    <div className="w-96 h-full bg-darkSurface border-l border-slate-800 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
      
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white mb-1">Diagnóstico SensioMat</h2>
        <p className="text-xs text-slate-400">Análise de Física de Materiais (Heurística)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Tratamento de Erro de Rede ou Lógica Interna */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 items-start">
            <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Relatório de Sucesso / Falha */}
        {simulationResult && (
          <>
            <div className={`p-4 rounded-lg flex items-center gap-3 border ${simulationResult.isApproved ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              {simulationResult.isApproved ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <AlertTriangle className="text-red-500 border-red-500/30" size={24} />
              )}
              <div>
                <h3 className={`font-bold ${simulationResult.isApproved ? 'text-green-400' : 'text-red-400'}`}>
                  {simulationResult.status}
                </h3>
                <p className="text-xs text-slate-300 opacity-80">
                  {simulationResult.isApproved 
                    ? 'A pilha de materiais suporta o ambiente selecionado.'
                    : 'Incompatibilidade crítica detetada nas propriedades.'}
                </p>
              </div>
            </div>

            {/* Lista de Alertas (Warnings) */}
            {simulationResult.report.warnings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Falhas Críticas Detetadas</h4>
                {simulationResult.report.warnings.map((warning, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded p-3 border-l-2 border-red-500">
                    <span className="text-[10px] font-bold text-red-400 uppercase">{warning.property} | Camada: {warning.layer}</span>
                    <p className="text-sm text-slate-300 mt-1">{warning.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Lista de Sucessos (Successes) */}
            {simulationResult.report.successes.length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aprovações Parciais</h4>
                {simulationResult.report.successes.map((success, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded p-3 border-l-2 border-green-500">
                    <span className="text-[10px] font-bold text-green-400 uppercase">{success.property} | Camada: {success.layer}</span>
                    <p className="text-sm text-slate-300 mt-1">{success.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}