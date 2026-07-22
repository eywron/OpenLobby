import { prisma } from '../lib/prisma';

export async function getNotifications(
  userId: string,
  options: {
    limit: number;
    skip: number;
    type?: string;
    unreadOnly: boolean;
  },
) {
  const where: {
    recipientId: string;
    readAt?: null;
    type?: 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW' | 'MENTION';
  } = {
    recipientId: userId,
  };

  if (options.unreadOnly) {
    where.readAt = null;
  }

  if (options.type) {
    where.type = options.type as any;
  }

  return prisma.notification.findMany({
    where,
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options.limit,
    skip: options.skip,
  });
}

export async function getUnreadCount(userId: string, type?: string) {
  return prisma.notification.count({
    where: {
      recipientId: userId,
      readAt: null,
      ...(type && { type: type as any }),
    },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function markAllNotificationsAsRead(userId: string, type?: string) {
  return prisma.notification.updateMany({
    where: {
      recipientId: userId,
      readAt: null,
      ...(type && { type: type as any }),
    },
    data: { readAt: new Date() },
  });
}

export async function deleteNotification(notificationId: string) {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}

export async function deleteAllNotifications(userId: string, type?: string) {
  return prisma.notification.deleteMany({
    where: {
      recipientId: userId,
      ...(type && { type: type as any }),
    },
  });
}

export async function createNotification(data: {
  recipientId: string;
  actorId: string;
  type: string;
  postId?: string;
  commentId?: string;
  content?: string;
}) {
  return prisma.notification.create({
    data: {
      recipientId: data.recipientId,
      actorUserId: data.actorId,
      type: data.type as 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW' | 'MENTION',
      postId: data.postId,
      commentId: data.commentId,
    },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function getNotificationById(notificationId: string) {
  return prisma.notification.findUnique({
    where: { id: notificationId },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
}
