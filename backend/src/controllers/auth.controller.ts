import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { createSuccessResponse } from '../utils/api-response.js';
import { syncUserSchema, deleteAccountSchema } from '../schemas/auth.schema.js';
import { AppError } from '../errors/app-error.js';
import { firebaseAuth } from '../config/firebase.js';

export const sync = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError({ statusCode: 401, message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1] || '';
  const decodedToken = await firebaseAuth.verifyIdToken(token);

  const parsedBody = syncUserSchema.parse(req.body);

  const firebaseUser = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    displayName: parsedBody.displayName || decodedToken.name,
    photoURL: decodedToken.picture,
    provider: decodedToken.firebase.sign_in_provider,
    emailVerified: decodedToken.email_verified,
  };

  const user = await authService.syncUser(firebaseUser, parsedBody.username);

  res.status(200).json(
    createSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    }),
  );
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError({ statusCode: 401, message: 'Unauthorized' });

  const profile = await authService.getUserProfile(req.user.userId);

  res.status(200).json(
    createSuccessResponse({
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        bannerUrl: profile.bannerUrl,
        bio: profile.bio,
        role: profile.role,
        accountStatus: profile.accountStatus,
        createdAt: profile.createdAt,
        settings: profile.settings,
        stats: {
          followers: profile._count?.followers || 0,
          following: profile._count?.following || 0,
          posts: profile._count?.posts || 0,
        },
      },
    }),
  );
};

export const deleteAccount = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError({ statusCode: 401, message: 'Unauthorized' });

  deleteAccountSchema.parse(req.body);

  await authService.deleteAccount(req.user.userId, req.user.firebaseUid);

  res.status(200).json(createSuccessResponse({ message: 'Account deleted successfully' }));
};
