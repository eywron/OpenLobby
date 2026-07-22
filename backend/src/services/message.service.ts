import { AppError } from '../errors/app-error';
import * as messageRepository from '../repositories/message.repository';
import { prisma } from '../lib/prisma';
import type { SendMessageInput, GetMessagesQuery } from '../schemas/message.schema';

export async function getConversations(userId: string, limit: number, skip: number) {
  const conversations = await messageRepository.findConversationsByUserId(userId, limit, skip);

  const result = await Promise.all(
    conversations.map(async (conv) => {
      const participant = conv.participants.find((p) => p.userId === userId);
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          createdAt: { gt: participant?.lastReadAt || new Date(0) },
        },
      });
      return {
        ...conv,
        unreadCount,
      };
    }),
  );

  return result;
}

export async function getOrStartConversation(currentUserId: string, targetUserId: string) {
  if (currentUserId === targetUserId) {
    throw new AppError({
      message: 'Cannot start a conversation with yourself',
      statusCode: 400,
      code: 'INVALID_TARGET_USER',
    });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser || targetUser.accountStatus !== 'ACTIVE') {
    throw new AppError({
      message: 'Target user not found or not active',
      statusCode: 404,
      code: 'USER_NOT_FOUND',
    });
  }

  const existing = await messageRepository.findDirectConversation(currentUserId, targetUserId);
  if (existing) {
    return existing;
  }

  return messageRepository.createDirectConversation(currentUserId, targetUserId);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  data: SendMessageInput,
) {
  const isParticipant = await messageRepository.isConversationParticipant(conversationId, senderId);
  if (!isParticipant) {
    throw new AppError({
      message: 'You are not a participant in this conversation',
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  }

  const message = await messageRepository.createMessage({
    conversationId,
    senderId,
    textContent: data.textContent,
    attachmentType: data.attachmentType,
    attachmentUrl: data.attachmentUrl,
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getMessages(conversationId: string, userId: string, query: GetMessagesQuery) {
  const isParticipant = await messageRepository.isConversationParticipant(conversationId, userId);
  if (!isParticipant) {
    throw new AppError({
      message: 'You are not a participant in this conversation',
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  }

  const messages = await messageRepository.findMessagesByConversationId(
    conversationId,
    query.limit,
    query.cursor,
  );

  let hasMore = false;
  if (messages.length > query.limit) {
    hasMore = true;
    messages.pop();
  }

  const nextCursor = hasMore ? messages[messages.length - 1]?.id || null : null;

  return {
    messages,
    hasMore,
    nextCursor,
  };
}

export async function markAsRead(conversationId: string, userId: string) {
  const isParticipant = await messageRepository.isConversationParticipant(conversationId, userId);
  if (!isParticipant) {
    throw new AppError({
      message: 'You are not a participant in this conversation',
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  }

  return messageRepository.updateLastReadAt(conversationId, userId);
}

export async function getUnreadCount(userId: string) {
  return messageRepository.getUnreadMessageCount(userId);
}
