export class SimulationEngine {
  static runHeuristicAnalysis(stack, environment) {
    const { substrate, circuit, encapsulation } = stack;
    const reqs = environment.requirements;

    const logs = [];
    let criticalFailuresCount = 0;

    // 1. MECÂNICA
    if (reqs.requiresFlexibility && !substrate.mechanical.isFlexible) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_mechanics",
        status: "CRITICAL_FAIL",
        layerKey: "layer_base",
        material: substrate.name,
        reasonKey: "reason_mech_fail",
        reasonVars: { modulus: substrate.mechanical.elasticModulusGPa }
      });
    } else {
      logs.push({
        propertyKey: "prop_mechanics",
        status: "PASS",
        layerKey: "layer_base",
        material: substrate.name,
        reasonKey: "reason_mech_pass"
      });
    }

    // 2. ELÉTRICA
    if (!circuit.electrical.isConductor) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_electrical",
        status: "CRITICAL_FAIL",
        layerKey: "layer_mid",
        material: circuit.name,
        reasonKey: "reason_elec_fail",
        reasonVars: { conductivity: circuit.electrical.conductivitySm, bandgap: circuit.electrical.bandgapEV }
      });
    } else {
      logs.push({
        propertyKey: "prop_electrical",
        status: "PASS",
        layerKey: "layer_mid",
        material: circuit.name,
        reasonKey: "reason_elec_pass"
      });
    }

    // 3. TÉRMICA ESTRUTURAL
    const maxLayerTemp = Math.min(
      substrate.thermal.maxOperatingTempC,
      circuit.thermal.maxOperatingTempC,
      encapsulation.thermal.maxOperatingTempC
    );

    if (reqs.maxOperatingTempC > maxLayerTemp) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_therm_struct",
        status: "CRITICAL_FAIL",
        layerKey: "layer_global",
        materialKey: "mat_multiple",
        reasonKey: "reason_therm_struct_fail",
        reasonVars: { envTemp: reqs.maxOperatingTempC, limitTemp: maxLayerTemp }
      });
    } else {
      logs.push({
        propertyKey: "prop_therm_struct",
        status: "PASS",
        layerKey: "layer_global",
        materialKey: "mat_multiple",
        reasonKey: "reason_therm_struct_pass"
      });
    }

    // 4. LEI DE FOURIER (FLUXO / CHOKE)
    const thermalMismatchRatio = circuit.thermal.thermalConductivityWmK / encapsulation.thermal.thermalConductivityWmK;
    if (reqs.maxOperatingTempC > 50 && thermalMismatchRatio > 1000) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_fourier",
        status: "CRITICAL_FAIL",
        layerKey: "layer_interface",
        material: `${circuit.name} / ${encapsulation.name}`,
        reasonKey: "reason_fourier_fail",
        reasonVars: { ratio: thermalMismatchRatio.toFixed(1) }
      });
    } else {
      logs.push({
        propertyKey: "prop_fourier",
        status: "PASS",
        layerKey: "layer_interface",
        material: `${circuit.name} / ${encapsulation.name}`,
        reasonKey: "reason_fourier_pass"
      });
    }

    // 5. MAGNÉTICA
    if (reqs.sensitiveToMagneticInterference && encapsulation.magnetic.causesInterference) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_magnetic",
        status: "CRITICAL_FAIL",
        layerKey: "layer_top",
        material: encapsulation.name,
        reasonKey: "reason_mag_fail",
        reasonVars: { behavior: encapsulation.magnetic.behavior }
      });
    } else {
      logs.push({
        propertyKey: "prop_magnetic",
        status: "PASS",
        layerKey: "layer_top",
        material: encapsulation.name,
        reasonKey: "reason_mag_pass"
      });
    }

    // 6. ÓPTICA
    if (reqs.requiresOpticalTransparency && !substrate.optical.isTransparent) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_optical",
        status: "CRITICAL_FAIL",
        layerKey: "layer_base",
        material: substrate.name,
        reasonKey: "reason_optic_fail"
      });
    } else {
      logs.push({
        propertyKey: "prop_optical",
        status: "PASS",
        layerKey: "layer_base",
        material: substrate.name,
        reasonKey: "reason_optic_pass"
      });
    }

    // 7. DETERIORATIVA (Corrosão e Bio)
    if (reqs.requiresBiocompatibility && (!substrate.deteriorative.isBiocompatible || !encapsulation.deteriorative.isBiocompatible)) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_bio",
        status: "CRITICAL_FAIL",
        layerKey: "layer_external",
        materialKey: "mat_sub_encap",
        reasonKey: "reason_bio_fail"
      });
    } else if (encapsulation.deteriorative.oxidationResistance < reqs.minOxidationResistance) {
      criticalFailuresCount++;
      logs.push({
        propertyKey: "prop_corrosion",
        status: "CRITICAL_FAIL",
        layerKey: "layer_top",
        material: encapsulation.name,
        reasonKey: "reason_corr_fail"
      });
    } else {
      logs.push({
        propertyKey: "prop_corrosion",
        status: "PASS",
        layerKey: "layer_top",
        material: encapsulation.name,
        reasonKey: "reason_corr_pass"
      });
    }

    const totalChecks = 7;
    const passedChecks = totalChecks - criticalFailuresCount;
    const viabilityScore = Math.round((passedChecks / totalChecks) * 100);

    return {
      simulationTimestamp: new Date().toISOString(),
      environmentTested: environment.name,
      globalStatus: criticalFailuresCount === 0 ? "APPROVED" : "REJECTED",
      viabilityScorePercentage: viabilityScore,
      propertiesAnalyzedCount: totalChecks,
      criticalFailuresDetected: criticalFailuresCount,
      diagnosticLogs: logs
    };
  }
}