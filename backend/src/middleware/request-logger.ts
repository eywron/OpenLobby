import type { RequestHandler } from 'express';

import { logger } from '../lib/logger';

export const requestLogger: RequestHandler = (request, response, next) => {
  const startedAt = Date.now();

  response.on('finish', () => {
    const durationMs = Date.now() - startedAt;

    logger.info(
      {
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs,
        userAgent: request.get('user-agent'),
      },
      'request completed',
    );
  });

  next();
};
