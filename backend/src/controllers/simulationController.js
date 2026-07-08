import { DataRepository } from '../repositories/dataRepository.js';
import { SimulationEngine } from '../services/simulationEngine.js';
import { MaterialsProjectService } from '../services/materialsProjectService.js';

export class SimulationController {
  static async getCatalog(req, res) {
    try {
      const [materials, environments] = await Promise.all([
        DataRepository.getAllMaterials(),
        DataRepository.getAllEnvironments()
      ]);

      return res.status(200).json({
        success: true,
        data: {
          materialsCount: materials.length,
          environmentsCount: environments.length,
          materials,
          environments
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Erro interno no servidor de propriedades",
        details: error.message
      });
    }
  }

  static async executeSimulation(req, res) {
    try {
      const { environmentId, stack } = req.body;

      if (!environmentId || !stack || !stack.substrate || !stack.circuit || !stack.encapsulation) {
        return res.status(400).json({
          success: false,
          error: "Payload inválido. É obrigatório fornecer o [environmentId] e um [stack] com as três camadas (substrate, circuit, encapsulation)."
        });
      }

      // Resolve as instâncias completas dos objetos no repositório
      const [environment, subMat, circMat, encMat] = await Promise.all([
        DataRepository.getEnvironmentById(environmentId),
        DataRepository.getMaterialById(stack.substrate),
        DataRepository.getMaterialById(stack.circuit),
        DataRepository.getMaterialById(stack.encapsulation)
      ]);

      const resolvedStack = {
        substrate: subMat,
        circuit: circMat,
        encapsulation: encMat
      };

      const simulationResult = SimulationEngine.runHeuristicAnalysis(resolvedStack, environment);

      return res.status(200).json({
        success: true,
        simulation: simulationResult
      });

    } catch (error) {
      const statusCode = error.message.includes("não foi encontrado") || error.message.includes("não catalogado") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // Lida com a requisição de sincronização
  static async syncMaterial(req, res) {
    try {
      const { materialId } = req.body;
      
      // Validação básica do formato do ID do Materials Project
      if (!materialId || !materialId.startsWith('mp-')) {
        return res.status(400).json({
          success: false,
          error: "Formato de ID inválido. Utilize o padrão do Materials Project (ex: mp-149 para Silício)."
        });
      }

      // Chama o serviço que bate na API do MIT/Berkeley e traduz os dados quânticos
      const mappedMaterial = await MaterialsProjectService.fetchAndMapMaterial(materialId);

      return res.status(200).json({
        success: true,
        message: "Material sincronizado e mapeado com sucesso para o padrão SensioMat.",
        data: mappedMaterial
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Falha na sincronização com o banco quântico.",
        details: error.message
      });
    }
  }
}