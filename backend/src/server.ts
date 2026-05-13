import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './utils/logger';
import bcrypt from 'bcryptjs';
import prisma, { connectWithRetry, checkDatabaseHealth } from './database/connection';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import instagramRoutes from './routes/instagram.routes';
import profileRoutes from './routes/profile.routes';
import { initScheduler } from './services/scheduler.service';

dotenv.config();

// ── Validate required environment variables ──────────────────
const REQUIRED_ENVS = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of REQUIRED_ENVS) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Security Middleware ───────────────────────────────────────
app.use(helmet());

// ── Robust CORS Configuration ────────────────────────────────
const rawFrontendUrl = process.env.FRONTEND_URL || '';
const cleanFrontendUrl = rawFrontendUrl.trim().replace(/\/$/, '');

const allowedOrigins = [
  cleanFrontendUrl,
  'https://viryon.vercel.app',
  'https://vyrion.vercel.app',
  'http://localhost:3001',
  'http://localhost:3000',
].filter(Boolean) as string[];

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Configuração de CORS (Seguindo roteiro solicitado) ────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://vyrion.vercel.app",
      "https://viryon.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Logging ───────────────────────────────────────────────────
const stream = { write: (msg: string) => logger.http(msg.trim()) };
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));

// ── Rate Limiting ─────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// ── Rota de Teste Rápido (PING) ───────────────────────────────
app.get('/ping', (_req, res) => res.send('pong'));

// ── Health check (Diagnostic Mode) ────────────────────────────
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Tenta verificar o banco, mas não trava o health check
    const dbStatus = await prisma.$queryRaw`SELECT 1`.then(() => 'connected').catch(() => 'disconnected');
    res.status(200).json({
      status: 'online',
      database: dbStatus,
      env: NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(200).json({ status: 'online', database: 'error', message: error.message });
  }
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/profiles', profileRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  logger.error(`[${status}] ${err.message} — ${req.method} ${req.originalUrl}`);
  res.status(status).json({
    error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// ── Startup ───────────────────────────────────────────────────
async function startServer() {
  try {
    logger.info(`🚀 Starting Instagram AI Agent (${NODE_ENV})...`);
    await connectWithRetry();

    // ── Self-Healing Automatic Seeding ───────────────────────────
    try {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        logger.info('🌱 Banco de dados vazio detectado. Iniciando seed automático...');
        
        // 1. Inserir Tags Padrão
        const defaultTags = [
          'nicho', 'cidade', 'produto', 'influencer', 'concorrente',
          'moda', 'fitness', 'tecnologia', 'viral', 'marketing'
        ];
        for (const tagName of defaultTags) {
          await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName }
          });
        }

        // 2. Criar Admin Padrão
        const adminEmail = 'admin@instagramagent.com';
        const plainPassword = 'AdminSecurePassword123!';
        const passwordHash = await bcrypt.hash(plainPassword, 12);

        const adminUser = await prisma.user.upsert({
          where: { email: adminEmail },
          update: {},
          create: {
            email: adminEmail,
            name: 'Agente IA Admin',
            passwordHash,
            role: 'ADMIN'
          }
        });

        // 3. Registrar Log Inicial
        await prisma.log.create({
          data: {
            level: 'INFO',
            context: 'DATABASE_SEED',
            message: 'Banco populado com sucesso no startup automático.',
            metaJson: JSON.stringify({ adminUserId: adminUser.id })
          }
        });

        logger.info(`✅ Seed automático concluído! Admin: ${adminEmail}`);
      }
    } catch (seedErr: any) {
      logger.error(`❌ Erro no seed automático: ${seedErr.message}`);
    }

    // Redis is optional — don't crash if unavailable
    try {
      const { connectRedis } = await import('./database/redis');
      await connectRedis();
    } catch (redisErr: any) {
      logger.warn(`⚠️  Redis not available: ${redisErr.message}. Continuing without cache.`);
    }

    app.listen(PORT, () => {
      logger.info(`✅ Server listening on port ${PORT}`);
      initScheduler();
    });
  } catch (error: any) {
    logger.error(`💥 Startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
