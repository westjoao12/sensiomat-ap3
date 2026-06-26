import { Router } from 'express';
import { SimulationController } from '../controllers/simulationController.js';

const router = Router();

// Rota de consulta de base de dados acadêmica
router.get('/catalog', SimulationController.getCatalog);

// Rota computacional de simulação heurística
router.post('/simulate', SimulationController.executeSimulation);

export default router;