import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsPath = path.join(__dirname, '../data/materials.json');
const environmentsPath = path.join(__dirname, '../data/environments.json');

export class DataRepository {
  static async getAllMaterials() {
    try {
      const rawData = await fs.promises.readFile(materialsPath, 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      throw new Error(`Falha crítica ao aceder ao repositório de materiais: ${error.message}`);
    }
  }

  static async getMaterialById(id) {
    const materials = await this.getAllMaterials();
    const material = materials.find((m) => m.id === id);
    if (!material) {
      throw new Error(`Material com o identificador [${id}] não foi encontrado na base do Callister.`);
    }
    return material;
  }

  static async getAllEnvironments() {
    try {
      const rawData = await fs.promises.readFile(environmentsPath, 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      throw new Error(`Falha crítica ao aceder ao repositório de ambientes: ${error.message}`);
    }
  }

  static async getEnvironmentById(id) {
    const envs = await this.getAllEnvironments();
    const environment = envs.find((e) => e.id === id);
    if (!environment) {
      throw new Error(`Ambiente operacional [${id}] não catalogado no sistema.`);
    }
    return environment;
  }
}