import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import * as messageController from '../controllers/message.controller';

export const conversationRouter = Router();
export const messageRouter = Router();

conversationRouter.use(authMiddleware);
messageRouter.use(authMiddleware);

conversationRouter.get('/', messageController.getConversations);
conversationRouter.post('/', messageController.startConversation);
conversationRouter.get('/:conversationId/messages', messageController.getMessages);
conversationRouter.post('/:conversationId/messages', messageController.sendMessage);
conversationRouter.post('/:conversationId/read', messageController.markAsRead);

messageRouter.get('/unread-count', messageController.getUnreadCount);
