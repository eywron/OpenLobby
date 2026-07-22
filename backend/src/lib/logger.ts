import pino from 'pino';

import { env } from '../config/env';

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  base: {
    service: 'openlobby-backend',
  },
});
