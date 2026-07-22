import { AppError } from '../errors/app-error';
import * as notificationRepository from '../repositories/notification.repository';
import type {
  GetNotificationsQuery,
  MarkNotificationAsReadInput,
  MarkAllNotificationsAsReadInput,
} from '../schemas/notification.schema';

export async function getNotifications(userId: string, query: GetNotificationsQuery) {
  const repoOptions: {
    limit: number;
    skip: number;
    type?: string;
    unreadOnly: boolean;
  } = {
    limit: query.limit,
    skip: query.skip,
    unreadOnly: query.unreadOnly,
  };

  if (query.type !== undefined) {
    repoOptions.type = query.type;
  }

  const notifications = await notificationRepository.getNotifications(userId, repoOptions);

  const total = await notificationRepository.getUnreadCount(userId, query.type);

  return {
    notifications,
    total,
    hasMore: query.skip + query.limit < total,
  };
}

export async function getUnreadCount(userId: string, type?: string) {
  return notificationRepository.getUnreadCount(userId, type);
}

export async function markAsRead(userId: string, input: MarkNotificationAsReadInput) {
  const notification = await notificationRepository.getNotificationById(input.notificationId);

  if (!notification) {
    throw new AppError({
      message: 'Notification not found',
      statusCode: 404,
      code: 'NOTIFICATION_NOT_FOUND',
    });
  }

  if (notification.recipientId !== userId) {
    throw new AppError({
      message: 'You can only mark your own notifications as read',
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  }

  return notificationRepository.markNotificationAsRead(input.notificationId);
}

export async function markAllAsRead(userId: string, input: MarkAllNotificationsAsReadInput) {
  return notificationRepository.markAllNotificationsAsRead(userId, input.type);
}

export async function deleteNotification(userId: string, notificationId: string) {
  const notification = await notificationRepository.getNotificationById(notificationId);

  if (!notification) {
    throw new AppError({
      message: 'Notification not found',
      statusCode: 404,
      code: 'NOTIFICATION_NOT_FOUND',
    });
  }

  if (notification.recipientId !== userId) {
    throw new AppError({
      message: 'You can only delete your own notifications',
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  }

  return notificationRepository.deleteNotification(notificationId);
}

export async function deleteAllNotifications(userId: string, type?: string) {
  return notificationRepository.deleteAllNotifications(userId, type);
}

export async function createNotification(data: {
  recipientId: string;
  actorId: string;
  type: 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW' | 'MENTION';
  postId?: string;
  commentId?: string;
}) {
  // Prevent self-notifications
  if (data.recipientId === data.actorId) {
    return null;
  }

  const createData: {
    recipientId: string;
    actorId: string;
    type: string;
    postId?: string;
    commentId?: string;
  } = {
    recipientId: data.recipientId,
    actorId: data.actorId,
    type: data.type,
  };

  if (data.postId !== undefined) createData.postId = data.postId;
  if (data.commentId !== undefined) createData.commentId = data.commentId;

  return notificationRepository.createNotification(createData);
}
