import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { apiLimiter } from './middleware/rate-limiter.js';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  // Rate limiting for all API routes
  app.use('/api', apiLimiter);

  // Parse JSON bodies and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression
  app.use(compression());

  // Logging
  app.use(requestLogger);

  // Mount API routes
  app.use('/api', apiRouter);

  // Global error handler
  app.use(errorHandler);

  return app;
};
