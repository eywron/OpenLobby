import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { authRouter } from './auth.routes.js';
import { postRouter } from './post.routes.js';
import { userRouter } from './user.routes.js';
import { uploadRouter } from './upload.routes.js';
import { notificationRouter } from './notification.routes.js';
import { messageRouter } from './message.routes.js';
import { moderationRouter } from './moderation.routes.js';
import { searchRouter } from './search.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/uploads', uploadRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/messages', messageRouter);
apiRouter.use('/moderation', moderationRouter);
apiRouter.use('/search', searchRouter);
