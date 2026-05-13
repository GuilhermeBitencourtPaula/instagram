import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './utils/logger';
import { connectWithRetry } from './database/connection';
import { initScheduler } from './services/scheduler.service';

// Importando Rotas
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import instagramRoutes from './routes/instagram.routes';
import profileRoutes from './routes/profile.routes';

dotenv.config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── PASSO 4: GARANTIR ORDEM CORRETA ──────────────────────────

// 1. JSON Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. PASSO 3: CONFIGURAR CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://vyrion.vercel.app",
      "https://viryon.vercel.app" // Seguro extra para o domínio atual
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ── PASSO 5: CRIAR HEALTH CHECK ───────────────────────────────
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "online"
  });
});

// Logs e Segurança Adicionais
app.use(helmet());
const stream = { write: (msg: string) => logger.http(msg.trim()) };
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));

// ── PASSO 4 (CONTINUAÇÃO): ROTAS ──────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/profiles', profileRoutes);

// ── PASSO 6: CONFIGURAR PORTA RAILWAY ─────────────────────────
const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    // Validação de DB
    await connectWithRetry();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      initScheduler();
    });
  } catch (error: any) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Iniciar
startServer();
