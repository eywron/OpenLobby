import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from '../lib/logger.js';

let redisClient: Redis | null = null;

if (env.REDIS_URL) {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redisClient.on('error', (err) => {
    logger.error({ err }, 'Redis connection error');
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis');
  });
}

export const redis = redisClient;
