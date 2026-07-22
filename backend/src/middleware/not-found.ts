import type { RequestHandler } from 'express';

import { AppError } from '../errors/app-error';

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(
    new AppError({
      message: 'Route not found',
      statusCode: 404,
      code: 'NOT_FOUND',
    }),
  );
};
