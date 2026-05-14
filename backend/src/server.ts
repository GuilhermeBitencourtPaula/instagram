import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import instagramRoutes from './routes/instagram.routes';
import profileRoutes from './routes/profile.routes';
import monitoringRoutes from './routes/monitoring.routes';

import { connectWithRetry } from './database/connection';
import { initScheduler } from './services/scheduler.service';

dotenv.config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Configuração Robusta de CORS
const allowedOrigins = [
  'https://viryon.vercel.app',
  'https://vyrion.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem "origin" (servidor-servidor ou ferramentas de teste)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado pelas políticas de CORS do Viryon'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Middlewares de Segurança e Log
app.use(helmet({ contentSecurityPolicy: false })); // Proteção contra ataques comuns
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { 
  stream: { write: (msg) => logger.http(msg.trim()) } 
}));

// 3. Rotas de Saúde e Status
app.get("/health", (_, res) => res.json({ status: "online", timestamp: new Date().toISOString() }));

// 4. Rotas Principais
app.use('/api/auth', authRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/monitoring', monitoringRoutes);
logger.info('Rotas de monitoramento registradas');



const PORT = process.env.PORT || 3000;

async function startServer() {
  const portNum = Number(PORT);
  
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`🚀 Viryon Server LIVE | Port: ${portNum} | Mode: ${NODE_ENV}`);
    initScheduler();
  });

  try {
    await connectWithRetry();
    console.log("✅ Database connected");
  } catch (error: any) {
    logger.error(`⚠️ Database failure: ${error.message}`);
  }
}

startServer();
