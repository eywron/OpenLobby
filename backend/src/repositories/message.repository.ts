import { prisma } from "../lib/prisma";
import type { MessageAttachmentType } from "@prisma/client";

export async function findDirectConversation(userId1: string, userId2: string) {
	return prisma.conversation.findFirst({
		where: {
			kind: "DIRECT",
			AND: [
				{ participants: { some: { userId: userId1 } } },
				{ participants: { some: { userId: userId2 } } }
			]
		},
		include: {
			participants: true
		}
	});
}

export async function createDirectConversation(userId1: string, userId2: string) {
	return prisma.conversation.create({
		data: {
			kind: "DIRECT",
			participants: {
				create: [
					{ userId: userId1 },
					{ userId: userId2 }
				]
			}
		},
		include: {
			participants: true
		}
	});
}

export async function findConversationsByUserId(userId: string, limit: number, skip: number) {
	return prisma.conversation.findMany({
		where: {
			participants: {
				some: { userId }
			}
		},
		include: {
			participants: {
				include: {
					user: {
						select: {
							id: true,
							username: true,
							displayName: true,
							avatarUrl: true
						}
					}
				}
			},
			messages: {
				orderBy: { createdAt: "desc" },
				take: 1
			}
		},
		orderBy: { updatedAt: "desc" },
		take: limit,
		skip: skip
	});
}

export async function findConversationById(conversationId: string) {
	return prisma.conversation.findUnique({
		where: { id: conversationId },
		include: {
			participants: true
		}
	});
}

export async function isConversationParticipant(conversationId: string, userId: string) {
	const participant = await prisma.conversationParticipant.findUnique({
		where: {
			conversationId_userId: {
				conversationId,
				userId
			}
		}
	});
	return !!participant;
}

export async function createMessage(data: {
	conversationId: string;
	senderId: string;
	textContent?: string;
	attachmentType?: MessageAttachmentType;
	attachmentUrl?: string;
}) {
	return prisma.message.create({
		data: {
			conversationId: data.conversationId,
			senderId: data.senderId,
			textContent: data.textContent,
			attachmentType: data.attachmentType,
			attachmentUrl: data.attachmentUrl
		}
	});
}

export async function findMessagesByConversationId(conversationId: string, limit: number, cursor?: string) {
	return prisma.message.findMany({
		where: { conversationId },
		include: {
			sender: {
				select: {
					id: true,
					username: true,
					displayName: true,
					avatarUrl: true
				}
			}
		},
		orderBy: { createdAt: "desc" },
		take: limit + 1,
		...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
	});
}

export async function updateLastReadAt(conversationId: string, userId: string) {
	return prisma.conversationParticipant.update({
		where: {
			conversationId_userId: {
				conversationId,
				userId
			}
		},
		data: {
			lastReadAt: new Date()
		}
	});
}

export async function getUnreadMessageCount(userId: string) {
	const participants = await prisma.conversationParticipant.findMany({
		where: { userId },
		select: { conversationId: true, lastReadAt: true }
	});

	if (participants.length === 0) return 0;

	let totalUnread = 0;
	
	for (const p of participants) {
		const unreadCount = await prisma.message.count({
			where: {
				conversationId: p.conversationId,
				senderId: { not: userId },
				createdAt: { gt: p.lastReadAt || new Date(0) }
			}
		});
		totalUnread += unreadCount;
	}

	return totalUnread;
}
