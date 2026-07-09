import React from 'react';
import useStore from '../../store/useStore';
import { AlertTriangle, CheckCircle, Info, XCircle, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Report() {
  const { t } = useTranslation();
  const { simulationResult, error } = useStore();

  if (!simulationResult && !error) {
    return (
      <div className="w-full h-full bg-white dark:bg-darkSurface border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center opacity-70 z-10 transition-colors duration-300">
        <Info size={32} className="text-slate-400 dark:text-slate-500 mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('report_empty', 'Configure a arquitetura de materiais e execute a simulação para gerar o diagnóstico.')}</p>
      </div>
    );
  }

  const isApproved = simulationResult?.globalStatus === "APPROVED";
  const logs = simulationResult?.diagnosticLogs || [];
  const warnings = logs.filter(log => log.status === "CRITICAL_FAIL");
  const successes = logs.filter(log => log.status === "PASS");

  return (
    <div className="w-full h-full bg-white dark:bg-darkSurface flex flex-col z-10 transition-colors duration-300">
      
      {/* HEADER DO RELATÓRIO */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 mb-0.5">
          <Activity className="text-brandAccent" size={20} />
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            {t('report_title', 'SensioMat Diagnostic')}
          </h2>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {t('report_subtitle', 'Análise de Física de Materiais (Heurística)')}
        </p>
        
        {simulationResult && (
          <div className="flex items-center gap-2 mt-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('env_label', 'Ambiente')}:</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate" title={t(simulationResult.environmentTested) || simulationResult.environmentTested}>
              {t(simulationResult.environmentTested) || simulationResult.environmentTested}
            </span>
          </div>
        )}
      </div>

      {/* CONTEÚDO DO RELATÓRIO COM SCROLL RESPONSIVO */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-start gap-3 mb-6">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {simulationResult && (
          <div className="mb-6">
            {/* Caixa de Diálogo Compacta e Responsiva */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
              isApproved 
                ? 'bg-green-50/60 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' 
                : 'bg-red-50/60 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
            }`}>
              {/* Esquerda: Status e Quantidade de Falhas */}
              <div className="flex items-start gap-2.5 min-w-0">
                {isApproved ? (
                  <CheckCircle size={20} className="text-green-500 dark:text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isApproved ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                    {isApproved ? t('status_approved', 'Projeto Aprovado') : t('status_rejected', 'Falha Crítica')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-tight truncate">
                    {isApproved 
                      ? t('no_failures', 'Nenhuma falha estrutural detectada.') 
                      : t('failures_count', `${warnings.length} falha(s) estrutural(is) detectada(s).`, { count: warnings.length })
                    }
                  </p>
                </div>
              </div>

              {/* Direita: Bloco de Score Isolado com Ícone por Cima */}
              <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-3 py-1.5 rounded-lg shadow-sm shrink-0 min-w-[64px]">
                <Activity size={12} className={isApproved ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} />
                <span className={`text-base font-black mt-0.5 leading-none ${isApproved ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {simulationResult.viabilityScorePercentage}%
                </span>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Score</span>
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO DE FALHAS CRÍTICAS */}
        {warnings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              {t('critical_failures', 'Falhas Críticas')}
            </h4>
            {warnings.map((warning, idx) => (
              <div key={idx} className="bg-white dark:bg-darkSurface border border-red-200 dark:border-red-900/40 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center gap-2 mb-2">
                   <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider truncate">
                     {t(warning.propertyKey)}
                   </span>
                   <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-transparent px-2 py-0.5 rounded-full shrink-0">
                     {t(warning.layerKey)}
                   </span>
                </div>
                {/* AQUI ACONTECE A MÁGICA DA TRADUÇÃO COM VARIÁVEIS */}
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {t(warning.reasonKey, warning.reasonVars)}
                </p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                  {t('material_label', 'Material')}: <span className="text-slate-600 dark:text-slate-300">
                    {warning.materialKey ? t(warning.materialKey) : warning.material}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SEÇÃO DE APROVAÇÕES PARCIAIS */}
        {successes.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              {t('partial_approvals', 'Aprovações Parciais')}
            </h4>
            {successes.map((success, idx) => (
              <div key={idx} className="bg-slate-50/50 dark:bg-slate-800/20 rounded-lg p-4 border-l-[3px] border-green-500 border-y border-r border-y-slate-100 border-r-slate-100 dark:border-y-transparent dark:border-r-transparent shadow-sm">
                <div className="flex justify-between items-center gap-2 mb-2">
                   <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider truncate">
                     {t(success.propertyKey)}
                   </span>
                   <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent px-2 py-0.5 rounded-full shrink-0">
                     {t(success.layerKey)}
                   </span>
                </div>
                {/* AQUI ACONTECE A MÁGICA DA TRADUÇÃO COM VARIÁVEIS */}
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {t(success.reasonKey, success.reasonVars)}
                </p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                  {t('material_label', 'Material')}: <span className="text-slate-600 dark:text-slate-300">
                    {success.materialKey ? t(success.materialKey) : success.material}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}