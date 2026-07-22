import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/upload.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadLimiter } from '../middleware/rate-limiter.js';
import { AppError } from '../errors/app-error.js';

export const uploadRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError({ statusCode: 400, message: 'Only images are allowed' }) as any);
    }
  },
});

uploadRouter.use(authMiddleware);
uploadRouter.use(uploadLimiter);

uploadRouter.post('/avatar', upload.single('file'), uploadController.uploadAvatar);
uploadRouter.post('/banner', upload.single('file'), uploadController.uploadBanner);
uploadRouter.post('/post-image', upload.single('file'), uploadController.uploadPostImage);
