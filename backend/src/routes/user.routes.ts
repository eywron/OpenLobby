import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/me', authMiddleware, userController.getProfile);
userRouter.patch('/me', authMiddleware, userController.updateProfile);
userRouter.get('/me/settings', authMiddleware, userController.getSettings);
userRouter.patch('/me/settings', authMiddleware, userController.updateSettings);

userRouter.get('/:username', userController.getPublicProfile);

userRouter.post('/me/follow', authMiddleware, userController.followUser);
userRouter.delete('/:userId/unfollow', authMiddleware, userController.unfollowUser);
userRouter.get('/:userId/follow-status', authMiddleware, userController.getFollowStatus);

userRouter.get('/:userId/followers', userController.getFollowers);
userRouter.get('/:userId/following', userController.getFollowing);
