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

// Captura erros fatais para evitar crashes silenciosos
process.on('uncaughtException', (err) => {
  console.error('💥 FATAL ERROR (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 FATAL ERROR (Unhandled Rejection):', reason);
});

// Configuração estrita de CORS para segurança do seu SaaS
const allowedOrigins = [
  'https://viryon.vercel.app',
  'https://vyrion.vercel.app', // Adicionando variação por segurança
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como ferramentas de teste)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pela política de CORS do Servidor Viryon'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permite o envio de tokens JWT entre domínios
}));

// 2. Outros Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
const stream = { write: (msg: string) => logger.http(msg.trim()) };
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));

// Rotas de Teste
app.get("/", (_, res) => res.json({ message: "Viryon API Online" }));
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
