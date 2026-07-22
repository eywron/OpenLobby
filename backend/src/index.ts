import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { redis } from './config/redis.js';
import { ensureBucket } from './config/minio.js';

const startServer = async () => {
  try {
    // Check database connection
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database');

    // Ensure MinIO bucket exists
    await ensureBucket();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await prisma.$disconnect();
          logger.info('Database connection closed');

          if (redis) {
            await redis.quit();
            logger.info('Redis connection closed');
          }

          process.exit(0);
        } catch (error) {
          logger.error({ err: error }, 'Error during shutdown');
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
