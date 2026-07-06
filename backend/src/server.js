import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware globais
app.use(cors({ origin: '*' })); // Liberado para o frontend React local
app.use(express.json());

// Verificação de vivência (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    service: "SensioMat Physics Engine", 
    status: "ONLINE", 
    runtime: `Node.js ${process.version}` 
  });
});

// Acoplamento de rotas v1
app.use('/api/v1', apiRoutes);

// Tratamento de rotas inexistentes (Fallback 404)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint científico não encontrado na API v1." });
});

// Só iniciamos o servidor localmente (quando NÃO estamos no ambiente do Vercel).
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`\n[SENSIOMAT ENGINE] Servidor de física reativa a rodar na porta ${PORT}`);
    console.log(`[CATÁLOGO] Aceda a: http://localhost:${PORT}/api/v1/catalog`);
    console.log(`[SIMULADOR] Pronto para receber requisições POST em /api/v1/simulate\n`);
  });

  // Encerramento limpo de processos
  process.on('SIGTERM', () => {
    console.log('Sinal SIGTERM recebido. A fechar o servidor de física...');
    server.close(() => {
      console.log('Servidor encerrado com sucesso.');
      process.exit(0);
    });
  });
}

// EXPORTAÇÃO OBRIGATÓRIA PARA O VERCEL SERVERLESS
export default app;