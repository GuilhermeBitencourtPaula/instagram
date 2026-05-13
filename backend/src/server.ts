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
import { connectWithRetry } from './database/connection';
import { initScheduler } from './services/scheduler.service';

dotenv.config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Defina estritamente quais origens têm permissão de acesso
const allowedOrigins = [
  'https://viryon.vercel.app', // Seu app de produção na Vercel
  'https://vyrion.vercel.app', // Variação de segurança
  'http://localhost:3000',      // Seu ambiente de testes local (Next.js)
  'http://localhost:3001'       // Backend local
];

// 2. Aplique a configuração do CORS antes das rotas
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem "origin" (como chamadas diretas de servidores backend ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado pelas políticas de CORS do Viryon'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Essencial se você for trafegar cookies ou tokens JWT entre domínios
}));

// 3. Middlewares de parseamento padrão
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helmet desativado temporariamente para garantir a eficácia do plano de CORS
// app.use(helmet());

const stream = { write: (msg: string) => logger.http(msg.trim()) };
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));

// Rotas de Teste
app.get("/", (_, res) => res.json({ message: "Viryon API Online", cors: "Permissive" }));
app.get("/health", (_, res) => res.json({ status: "online" }));

// Rotas do Sistema
app.use('/api/auth', authRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/profiles', profileRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  const portNum = Number(PORT);
  
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`🚀 Viryon Server is LIVE on port ${portNum}`);
    initScheduler();
  });

  try {
    await connectWithRetry();
    console.log("✅ Database connected successfully");
  } catch (error: any) {
    console.error(`⚠️ Database connection warning: ${error.message}`);
  }
}

startServer();
