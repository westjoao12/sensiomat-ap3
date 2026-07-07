import axios from 'axios';

export class MaterialsProjectService {
  /**
   * Conecta à API do Materials Project e mapeia propriedades quânticas de cristais para o SensioMat.
   * @param {string} materialId - ID único do Materials Project (Ex: mp-149)
   */
  static async fetchAndMapMaterial(materialId) {
    const apiKey = process.env.MATERIALS_PROJECT_API_KEY;
    if (!apiKey) throw new Error("API Key do Materials Project não configurada no .env.");

    const url = `https://api.materialsproject.org/materials/${materialId}/summary/`;

    try {
      const response = await axios.get(url, {
        headers: { 'X-API-KEY': apiKey }
      });

      const raw = response.data.data[0];
      if (!raw) throw new Error("Material não localizado no banco quântico da API.");

      // MAPEAMENTO INTELIGENTE DA FÍSICA DE MATERIAIS
      return {
        id: `mp_${raw.material_id}`,
        name: `${raw.formula_pretty} (Via MP API)`,
        category: raw.is_metal ? "Metal" : "Semicondutor",
        mechanical: {
          elasticModulusGPa: raw.bulk_modulus?.voigt || 120, // Heurística fallback
          tensileStrengthMPa: raw.is_metal ? 250 : 50,
          isFlexible: raw.bulk_modulus?.voigt < 100
        },
        electrical: {
          conductivitySm: raw.is_metal ? 1.0e6 : 1.0e-2,
          bandgapEV: raw.band_gap || 0,
          isConductor: raw.band_gap === 0
        },
        thermal: {
          thermalConductivityWmK: raw.is_metal ? 150 : 1.5,
          maxOperatingTempC: raw.is_metal ? 600 : 250
        },
        magnetic: {
          behavior: raw.ordering || "Diamagnético",
          causesInterference: raw.ordering === "Ferromagnetic"
        },
        optical: {
          isTransparent: raw.band_gap > 3.0 // Transparência no espectro visível por gap de energia
        },
        deteriorative: {
          oxidationResistance: raw.energy_above_hull < 0.1 ? 9 : 4, // Estabilidade termodinâmica
          isBiocompatible: false // Requer curadoria médica humana
        }
      };
    } catch (error) {
      throw new Error(`Erro na ponte de dados quânticos: ${error.message}`);
    }
  }
}