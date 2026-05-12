import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './utils/logger';
import { connectWithRetry, checkDatabaseHealth } from './database/connection';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Custom Morgan stream for Winston
const stream = {
  write: (message: string) => logger.http(message.trim()),
};
app.use(morgan('combined', { stream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Enhanced health check including database
app.get('/health', async (_req: Request, res: Response) => {
  try {
    const dbHealthy = await checkDatabaseHealth();
    res.status(200).json({ 
      status: 'ok', 
      database: dbHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error(`Health check failed: ${error.message}`);
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/searches', searchRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Start function to ensure DB is connected before server
async function startServer() {
  try {
    await connectWithRetry();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    logger.error('Failed to start server due to database connection issues');
    process.exit(1);
  }
}

startServer();
