import { createClient } from 'redis';
import logger from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL;

// Só cria o cliente se existir uma URL configurada
const redisClient = REDIS_URL 
  ? createClient({ url: REDIS_URL })
  : null;

if (redisClient) {
  redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err.message}`));
  redisClient.on('connect', () => logger.info('Redis conectado com sucesso.'));
}

export const connectRedis = async () => {
  if (!redisClient) return;
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error: any) {
    logger.error(`Falha ao conectar ao Redis: ${error.message}`);
  }
};

export default redisClient;
