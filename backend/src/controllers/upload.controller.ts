import { Request, Response } from 'express';
import * as storageService from '../services/storage.service.js';
import * as authRepo from '../repositories/auth.repository.js';
import { createSuccessResponse } from '../utils/api-response.js';
import { AppError } from '../errors/app-error.js';

const validateImage = (req: Request) => {
  if (!req.file) {
    throw new AppError({ statusCode: 400, message: 'No file uploaded' });
  }
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError({ statusCode: 400, message: 'Only images are allowed' });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError({ statusCode: 401, message: 'Unauthorized' });
  validateImage(req);

  const { url } = await storageService.uploadAvatar(
    req.user.userId,
    req.file!.buffer,
    req.file!.mimetype,
  );

  await authRepo.updateUserProfile(req.user.userId, { avatarUrl: url });

  res.status(200).json(createSuccessResponse({ url }));
};

export const uploadBanner = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError({ statusCode: 401, message: 'Unauthorized' });
  validateImage(req);

  const { url } = await storageService.uploadBanner(
    req.user.userId,
    req.file!.buffer,
    req.file!.mimetype,
  );

  await authRepo.updateUserProfile(req.user.userId, { bannerUrl: url });

  res.status(200).json(createSuccessResponse({ url }));
};

export const uploadPostImage = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError({ statusCode: 401, message: 'Unauthorized' });
  validateImage(req);

  const postId = req.body.postId || 'temp_' + Date.now();
  const index = parseInt(req.body.index || '0', 10);

  const result = await storageService.uploadPostImage(
    postId,
    req.file!.buffer,
    req.file!.mimetype,
    index,
  );

  res.status(200).json(createSuccessResponse(result));
};
