import { Request, Response, NextFunction } from 'express';
import redisClient from '../database/redis';
import logger from '../utils/logger';

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    
    const client = redisClient;
    
    try {
      if (!client || !client.isOpen) {
        return next();
      }

      const cachedResponse = await client.get(key);

      if (cachedResponse) {
        logger.debug(`Cache hit for ${key}`);
        const data = typeof cachedResponse === 'string' ? cachedResponse : cachedResponse.toString();
        return res.status(200).json(JSON.parse(data));
      }

      // If not cached, override res.json to store the response
      const originalJson = res.json;
      res.json = (body) => {
        client.setEx(key, duration, JSON.stringify(body));
        return originalJson.call(res, body);
      };

      next();
    } catch (error: any) {
      logger.error(`Erro no middleware de cache: ${error.message}`);
      next();
    }
  };
};
