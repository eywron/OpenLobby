import { rateLimit, Options } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';
import { createErrorResponse } from '../utils/api-response.js';
import { env } from '../config/env.js';

export const createRateLimiter = (windowMs: number, max: number, message = 'Too many requests') => {
  const options: Partial<Options> = {
    windowMs,
    max,
    message: createErrorResponse({ code: 'RATE_LIMIT_EXCEEDED', message }) as any,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(429).json(options.message);
    },
  };

  if (redis && env.NODE_ENV !== 'test') {
    options.store = new RedisStore({
      sendCommand: (...args: string[]) => (redis as any).call(...args),
    });
  }

  return rateLimit(options);
};

export const authLimiter = createRateLimiter(
  60 * 1000,
  5,
  'Too many auth attempts, please try again later',
);
export const apiLimiter = createRateLimiter(
  60 * 1000,
  100,
  'Too many API requests, please try again later',
);
export const uploadLimiter = createRateLimiter(
  60 * 1000,
  10,
  'Too many uploads, please try again later',
);
