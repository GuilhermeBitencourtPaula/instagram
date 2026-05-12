import { createClient } from 'redis';
import logger from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err.message}`));
redisClient.on('connect', () => logger.info('Redis conectado com sucesso.'));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error: any) {
    logger.error(`Falha ao conectar ao Redis: ${error.message}`);
  }
};

export default redisClient;
