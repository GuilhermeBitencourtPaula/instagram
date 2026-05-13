import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient with custom query logging and performance connection pool parameters
// The underlying engine manages a threaded database connection pool automatically.
const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

/**
 * Validates the MySQL connection status via lightweight query.
 * Throws a detailed error message if unreachable.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1 as connected`;
    return true;
  } catch (error: any) {
    throw new Error(`MySQL HealthCheck Falhou: ${error.message || error}`);
  }
}

/**
 * Establishes database connection ensuring a retry mechanism.
 * Automatically tries to connect multiple times with exponential backoff if the database is starting up.
 * 
 * @param retries Maximum connection attempts
 * @param delayMs Base delay in milliseconds between retries
 */
export async function connectWithRetry(retries = 5, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[MySQL] Tentando conectar ao banco de dados (Tentativa ${attempt}/${retries})...`);
      await prisma.$connect();
      // Execute health check to verify communication pipeline
      await checkDatabaseHealth();
      console.log(`[MySQL] Conexão com o banco de dados estabelecida com sucesso!`);
      return;
    } catch (error: any) {
      console.error(`[MySQL] Falha na conexão (Tentativa ${attempt}/${retries}):`, error.message || error);
      if (attempt === retries) {
        console.error(`[MySQL] Esgotadas todas as tentativas de conexão com o banco de dados.`);
        throw error;
      }
      // Calculate exponential backoff wait time
      const waitTime = delayMs * Math.pow(1.5, attempt - 1);
      console.log(`[MySQL] Aguardando ${Math.round(waitTime)}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Graceful shutdown listener to terminate pool safely
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
