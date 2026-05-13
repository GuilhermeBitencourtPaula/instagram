import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import instagramRoutes from './routes/instagram.routes';
import profileRoutes from './routes/profile.routes';
import { connectWithRetry } from './database/connection';
import { initScheduler } from './services/scheduler.service';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// ── PASSO 2: CONFIGURAÇÃO DE CORS ──────────────────────────
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

app.use(helmet());

app.get("/", (_, res) => {
  return res.json({
    message: "API ONLINE",
  });
});

app.get("/health", (_, res) => {
  return res.json({
    status: "online",
  });
});

// ── PRESERVANDO AS ROTAS PARA O LOGIN FUNCIONAR (PASSO 14) ──
app.use('/api/auth', authRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/profiles', profileRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
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

startServer();
