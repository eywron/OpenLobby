import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/app-error.js';
import { logger } from '../lib/logger.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError({ statusCode: 401, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1] || '';
    let decodedToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch (error) {
      throw new AppError({ statusCode: 401, message: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      throw new AppError({ statusCode: 401, message: 'User not found. Please sync user first.' });
    }

    if (user.accountStatus === 'SUSPENDED' || user.accountStatus === 'DELETED') {
      throw new AppError({ statusCode: 403, message: 'Account is not active' });
    }

    req.user = {
      userId: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1] || '';
    let decodedToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch (error) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (user && user.accountStatus !== 'SUSPENDED' && user.accountStatus !== 'DELETED') {
      req.user = {
        userId: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError({ statusCode: 401, message: 'Unauthorized' }));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError({ statusCode: 403, message: 'Forbidden' }));
    }

    next();
  };
};
