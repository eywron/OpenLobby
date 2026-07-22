import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

export const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get('/', notificationController.getNotifications);
notificationRouter.get('/unread-count', notificationController.getUnreadCount);

notificationRouter.post('/:notificationId/read', notificationController.markAsRead);
notificationRouter.post('/read-all', notificationController.markAllAsRead);

notificationRouter.delete('/:notificationId', notificationController.deleteNotification);
notificationRouter.delete('/', notificationController.deleteAllNotifications);
