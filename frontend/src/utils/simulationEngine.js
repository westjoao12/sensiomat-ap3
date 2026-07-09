export function runSimulation(slots) {
  const { topo, meio, base } = slots;
  
  if (!topo || !meio || !base) {
    return {
      status: 'Incompleto',
      score: 0,
      criticalFailures: [{ key: 'err_fill_layers' }],
      approvals: []
    };
  }

  let score = 100;
  const criticalFailures = [];
  const approvals = [];

  // 1. Mecânica
  if (base.category === 'Cerâmica' || base.category === 'Metal' || base.category === 'CERÂMICA' || base.category === 'METAL') {
    score -= 40;
    criticalFailures.push({ property: 'MECÂNICA', layer: 'Substrato', key: 'err_mechanics', material: base.name });
  } else {
    approvals.push({ property: 'MECÂNICA', layer: 'Substrato', key: 'ok_mechanics', material: base.name });
  }

  // 2. Elétrica
  if (meio.category === 'Polímero' || meio.category === 'Cerâmica' || meio.category === 'POLÍMERO' || meio.category === 'CERÂMICA') {
    score -= 50;
    criticalFailures.push({ property: 'ELÉTRICA', layer: 'Circuito Ativo', key: 'err_electrical', material: meio.name });
  } else {
    approvals.push({ property: 'ELÉTRICA', layer: 'Circuito Ativo', key: 'ok_electrical', material: meio.name });
  }

  // 3. Térmica
  if (topo.category === 'Metal' || topo.category === 'METAL') {
    score -= 30;
    criticalFailures.push({ property: 'TÉRMICA', layer: 'Encapsulamento', key: 'err_thermal', material: topo.name });
  } else {
    approvals.push({ property: 'TÉRMICA', layer: 'Encapsulamento', key: 'ok_thermal', material: topo.name });
  }

  // ATENÇÃO: Uniformizei o retorno para bater certo com as chaves que o frontend espera.
  return {
    globalStatus: score >= 80 ? 'APPROVED' : score > 0 ? 'REJECTED' : 'REJECTED',
    viabilityScorePercentage: Math.max(0, score),
    criticalFailuresDetected: criticalFailures.length,
    diagnosticLogs: [...criticalFailures.map(f => ({...f, status: 'CRITICAL_FAIL'})), ...approvals.map(a => ({...a, status: 'PASS'}))]
  };
}