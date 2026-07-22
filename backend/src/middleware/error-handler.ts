import type { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/app-error';
import { logger } from '../lib/logger';
import { createErrorResponse } from '../utils/api-response';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const appError = error instanceof AppError ? error : undefined;
  const statusCode = appError?.statusCode ?? 500;
  const code = appError?.code ?? 'INTERNAL_SERVER_ERROR';
  const message = appError?.message ?? 'An unexpected error occurred';

  if (statusCode >= 500) {
    logger.error(
      {
        error,
        method: request.method,
        path: request.originalUrl,
      },
      'Unhandled backend error',
    );
  }

  response.status(statusCode).json(
    createErrorResponse({
      code,
      message,
      details: appError?.details,
    }),
  );
};
