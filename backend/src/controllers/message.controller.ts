import type { Request, Response } from "express";

import { AppError } from "../errors/app-error";
import { createSuccessResponse, createErrorResponse } from "../utils/api-response";
import {
	startConversationSchema,
	sendMessageSchema,
	getMessagesQuerySchema
} from "../schemas/message.schema";
import * as messageService from "../services/message.service";

export async function getConversations(request: Request, response: Response): Promise<void> {
	const userId = request.user?.userId;
	if (!userId) {
		throw new AppError({
			message: "User not authenticated",
			statusCode: 401,
			code: "UNAUTHORIZED"
		});
	}

	const limit = parseInt(request.query.limit as string) || 50;
	const skip = parseInt(request.query.skip as string) || 0;

	const result = await messageService.getConversations(userId, limit, skip);
	response.status(200).json(createSuccessResponse(result, "Conversations retrieved"));
}

export async function startConversation(request: Request, response: Response): Promise<void> {
	const userId = request.user?.userId;
	if (!userId) {
		throw new AppError({
			message: "User not authenticated",
			statusCode: 401,
			code: "UNAUTHORIZED"
		});
	}

	const validation = startConversationSchema.safeParse(request.body);
	if (!validation.success) {
		response.status(400).json(
			createErrorResponse({
				code: "VALIDATION_ERROR",
				message: "Invalid input",
				details: validation.error.flatten()
			})
		);
		return;
	}

	const result = await messageService.getOrStartConversation(userId, validation.data.targetUserId);
	response.status(200).json(createSuccessResponse(result, "Conversation started"));
}

export async function sendMessage(request: Request, response: Response): Promise<void> {
	const userId = request.user?.userId;
	if (!userId) {
		throw new AppError({
			message: "User not authenticated",
			statusCode: 401,
			code: "UNAUTHORIZED"
		});
	}

	const conversationId = Array.isArray(request.params.conversationId)
		? request.params.conversationId[0]
		: request.params.conversationId;
	if (!conversationId) {
		throw new AppError({
			message: "Conversation ID is required",
			statusCode: 400,
			code: "MISSING_CONVERSATION_ID"
		});
	}

	const validation = sendMessageSchema.safeParse(request.body);
	if (!validation.success) {
		response.status(400).json(
			createErrorResponse({
				code: "VALIDATION_ERROR",
				message: "Invalid input",
				details: validation.error.flatten()
			})
		);
		return;
	}

	const result = await messageService.sendMessage(conversationId, userId, validation.data);
	response.status(200).json(createSuccessResponse(result, "Message sent"));
}

export async function getMessages(request: Request, response: Response): Promise<void> {
	const userId = request.user?.userId;
	if (!userId) {
		throw new AppError({
			message: "User not authenticated",
			statusCode: 401,
			code: "UNAUTHORIZED"
		});
	}

	const conversationId = Array.isArray(request.params.conversationId)
		? request.params.conversationId[0]
		: request.params.conversationId;
	if (!conversationId) {
		throw new AppError({
			message: "Conversation ID is required",
			statusCode: 400,
			code: "MISSING_CONVERSATION_ID"
		});
	}

	const validation = getMessagesQuerySchema.safeParse(request.query);
	if (!validation.success) {
		response.status(400).json(
			createErrorResponse({
				code: "VALIDATION_ERROR",
				message: "Invalid query parameters",
				details: validation.error.flatten()
			})
		);
		return;
	}

	const result = await messageService.getMessages(conversationId, userId, validation.data);
	response.status(200).json(createSuccessResponse(result, "Messages retrieved"));
}

export async function markAsRead(request: Request, response: Response): Promise<void> {
	const userId = request.user?.userId;
	if (!userId) {
		throw new AppError({
			message: "User not authenticated",
			statusCode: 401,
			code: "UNAUTHORIZED"
		});
	}

	const conversationId = Array.isArray(request.params.conversationId)
		? request.params.conversationId[0]
		: request.params.conversationId;
	if (!conversationId) {
		throw new AppError({
			message: "Conversation ID is required",
			statusCode: 400,
			code: "MISSING_CONVERSATION_ID"
		});
	}

	const result = await messageService.markAsRead(conversationId, userId);
	response.status(200).json(createSuccessResponse(result, "Conversation marked as read"));
}

export async function getUnreadCount(request: Request, response: Response): Promise<void> {
	const userId = request.user?.userId;
	if (!userId) {
		throw new AppError({
			message: "User not authenticated",
			statusCode: 401,
			code: "UNAUTHORIZED"
		});
	}

	const unreadCount = await messageService.getUnreadCount(userId);
	response.status(200).json(createSuccessResponse({ unreadCount }, "Unread count retrieved"));
}
