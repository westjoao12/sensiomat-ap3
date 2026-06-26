import React from 'react';
import useStore from '../../store/useStore';
import { AlertTriangle, CheckCircle, Info, XCircle, Activity } from 'lucide-react';

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

  // Mapeamento correto da nova estrutura do backend (SimulationEngine.js)
  const isApproved = simulationResult?.globalStatus === "APPROVED";
  const logs = simulationResult?.diagnosticLogs || [];
  const warnings = logs.filter(log => log.status === "CRITICAL_FAIL");
  const successes = logs.filter(log => log.status === "PASS");

  return (
    <div className="w-96 h-full bg-darkSurface border-l border-slate-800 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
      
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white mb-1">Diagnóstico SensioMat</h2>
        <p className="text-xs text-slate-400">Análise de Física de Materiais (Heurística)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 items-start">
            <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {simulationResult && (
          <>
            <div className={`p-4 rounded-lg flex items-center justify-between border ${isApproved ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-3">
                {isApproved ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <AlertTriangle className="text-red-500" size={24} />
                )}
                <div>
                  <h3 className={`font-bold ${isApproved ? 'text-green-400' : 'text-red-400'}`}>
                    {isApproved ? 'Aprovado' : 'Falha Crítica'}
                  </h3>
                  <p className="text-xs text-slate-300 opacity-80">
                    {isApproved 
                      ? 'Pilha termodinamicamente estável.'
                      : `${simulationResult.criticalFailuresDetected} falha(s) estrutural(is) detetada(s).`}
                  </p>
                </div>
              </div>
              
              {/* Exibição da nova pontuação de viabilidade do backend */}
              <div className="flex flex-col items-center justify-center bg-slate-900 rounded p-2 border border-slate-700">
                 <Activity size={14} className="text-brandAccent mb-1" />
                 <span className="text-xs font-bold text-white">{simulationResult.viabilityScorePercentage}%</span>
              </div>
            </div>

            {warnings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Falhas Críticas Detetadas</h4>
                {warnings.map((warning, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded p-3 border-l-2 border-red-500">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[10px] font-bold text-red-400 uppercase">{warning.property}</span>
                       <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">{warning.layer}</span>
                    </div>
                    {/* Alterado para ler 'scientificReason' em vez de 'message' */}
                    <p className="text-sm text-slate-300 mt-1">{warning.scientificReason}</p>
                    <p className="text-[10px] text-slate-500 mt-2">Material testado: {warning.material}</p>
                  </div>
                ))}
              </div>
            )}

            {successes.length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aprovações Parciais</h4>
                {successes.map((success, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded p-3 border-l-2 border-green-500">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[10px] font-bold text-green-400 uppercase">{success.property}</span>
                       <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">{success.layer}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{success.scientificReason}</p>
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