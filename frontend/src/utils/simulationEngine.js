
export function runSimulation(slots) {
  const { topo, meio, base } = slots;
  
  // Se faltar algum material, a simulação falha imediatamente
  if (!topo || !meio || !base) {
    return {
      status: 'Incompleto',
      score: 0,
      criticalFailures: ["Preencha todas as camadas da arquitetura para simular."],
      approvals: []
    };
  }

  let score = 100;
  const criticalFailures = [];
  const approvals = [];

  // 1. Análise Mecânica (Base/Substrato)
  // O substrato num biossensor epidérmico precisa de ser flexível (Polímeros geralmente têm baixo módulo de Young)
  if (base.category === 'CERÂMICA' || base.category === 'METAL') {
    score -= 40;
    criticalFailures.push(`MECÂNICA: O ambiente exige conformação flexível, mas o material da base (${base.name}) tem comportamento rígido/frágil.`);
  } else {
    approvals.push(`MECÂNICA: Integridade estrutural e flexibilidade garantidas pelo material ${base.name}.`);
  }

  // 2. Análise Elétrica (Meio/Circuito)
  // O circuito ativo precisa de ser altamente condutivo (Metais ou Materiais 2D como Grafeno)
  if (meio.category === 'POLÍMERO' || meio.category === 'CERÂMICA') {
    score -= 50;
    criticalFailures.push(`ELÉTRICA: Falha no circuito. ${meio.name} é um isolante e não permite mobilidade eletrónica adequada.`);
  } else {
    approvals.push(`ELÉTRICA: Alta mobilidade eletrónica garantida pela escolha de ${meio.name}.`);
  }

  // 3. Análise Térmica/Isolamento (Topo/Encapsulamento)
  // O topo precisa proteger o circuito do ambiente e evitar superaquecimento da pele
  if (topo.category === 'METAL') {
    score -= 30;
    criticalFailures.push(`TÉRMICA: ${topo.name} no encapsulamento causa dissipação térmica excessiva para a epiderme.`);
  } else {
    approvals.push(`TÉRMICA: Estabilidade e isolamento térmico garantidos por ${topo.name}.`);
  }

  return {
    status: score >= 80 ? 'Aprovado' : score > 0 ? 'Falha Crítica' : 'Inviável',
    score: Math.max(0, score),
    criticalFailures,
    approvals
  };
}