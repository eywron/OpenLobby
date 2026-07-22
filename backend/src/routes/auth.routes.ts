import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rate-limiter.js';

export const authRouter = Router();

// Apply auth rate limiter to all auth routes
authRouter.use(authLimiter);

authRouter.post('/sync', authController.sync);
authRouter.get('/me', authMiddleware, authController.me);
authRouter.delete('/account', authMiddleware, authController.deleteAccount);
