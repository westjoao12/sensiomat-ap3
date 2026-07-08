export class MaterialsProjectService {

    static BASE_URL = "https://api.materialsproject.org";

    // Busca um material na API do Materials Project usando fetch nativo
    static async fetchSummary(materialId) {
        const apiKey = process.env.MATERIALS_PROJECT_API_KEY;

        if (!apiKey) {
            throw new Error("A variável MATERIALS_PROJECT_API_KEY não foi encontrada.");
        }

        const fields = [
            "material_id",
            "formula_pretty",
            "is_metal",
            "band_gap",
            "ordering",
            "energy_above_hull",
            "density",
            "volume",
            "elements",
            "nsites",
            "symmetry"
        ].join(",");

        const url = `${this.BASE_URL}/materials/summary?material_ids=${materialId}&_fields=${fields}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-API-KEY": apiKey,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Materials Project (${response.status}) -> ${body}`);
        }

        const json = await response.json();

        if (!json.data || json.data.length === 0) {
            throw new Error(`Material ${materialId} não encontrado.`);
        }

        return json.data[0];
    }

    // Traduz o modelo do Materials Project para o modelo do SensioMat
    static mapToSensioMat(raw) {
        const isMetal = raw.is_metal === true;
        const bandGap = raw.band_gap ?? 0;
        const ordering = raw.ordering ?? "Unknown";
        const energyHull = raw.energy_above_hull ?? 999;

        return {
            id: `mat_${raw.material_id.replace("-", "_")}`,
            externalId: raw.material_id,
            source: "Materials Project",
            name: raw.formula_pretty,
            category: isMetal ? "Metal" : "Semicondutor",
            
            crystal: {
                density: raw.density,
                volume: raw.volume,
                elements: raw.elements,
                atoms: raw.nsites,
                symmetry: raw.symmetry
            },

            mechanical: {
                // Heurística restaurada para não quebrar as equações e logs do SimulationEngine
                elasticModulusGPa: isMetal ? 120 : 250,
                tensileStrengthMPa: isMetal ? 250 : 50,
                isFlexible: isMetal // Metais puros tendem a ser mais dúcteis/conformáveis que semicondutores
            },

            electrical: {
                bandgapEV: bandGap,
                conductivitySm: isMetal ? 1e6 : 1e-2,
                isConductor: bandGap <= 0.01
            },

            thermal: {
                thermalConductivityWmK: isMetal ? 180 : 1.5,
                maxOperatingTempC: isMetal ? 650 : 250
            },

            magnetic: {
                behavior: ordering,
                causesInterference: ordering === "FM" || ordering === "Ferromagnetic"
            },

            optical: {
                isTransparent: bandGap > 3
            },

            deteriorative: {
                oxidationResistance: energyHull < 0.05 ? 10 : energyHull < 0.10 ? 8 : energyHull < 0.20 ? 6 : 3,
                isBiocompatible: false
            }
        };
    }

    // Método público usado pelo Controller
    static async fetchAndMapMaterial(materialId) {
        try {
            const raw = await this.fetchSummary(materialId);
            return this.mapToSensioMat(raw);
        } catch (error) {
            throw new Error(`Erro ao consultar o Materials Project: ${error.message}`);
        }
    }
}