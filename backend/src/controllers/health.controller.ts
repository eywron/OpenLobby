import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { redis } from '../config/redis.js';
import { minioClient } from '../config/minio.js';
import { env } from '../config/env.js';
import { createSuccessResponse } from '../utils/api-response.js';

export const checkHealth = async (req: Request, res: Response) => {
  const services: Record<string, string> = {
    api: 'ok',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    services.database = 'ok';
  } catch (error) {
    services.database = 'error';
  }

  if (redis) {
    try {
      await redis.ping();
      services.redis = 'ok';
    } catch (error) {
      services.redis = 'error';
    }
  }

  try {
    await minioClient.bucketExists(env.MINIO_BUCKET);
    services.minio = 'ok';
  } catch (error) {
    services.minio = 'error';
  }

  const isHealthy = Object.values(services).every((status) => status === 'ok');

  res.status(isHealthy ? 200 : 503).json(
    createSuccessResponse({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services,
    }),
  );
};
