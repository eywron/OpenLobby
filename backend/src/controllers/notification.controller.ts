import type { Request, Response } from "express";

import { AppError } from "../errors/app-error";
import { createSuccessResponse, createErrorResponse } from "../utils/api-response";
import {
  getNotificationsQuerySchema,
  markNotificationAsReadSchema,
  markAllNotificationsAsReadSchema
} from "../schemas/notification.schema";
import * as notificationService from "../services/notification.service";

export async function getNotifications(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const validation = getNotificationsQuerySchema.safeParse(request.query);
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

  const result = await notificationService.getNotifications(userId, validation.data);
  response.status(200).json(createSuccessResponse(result, "Notifications retrieved"));
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

  const type = request.query.type as string | undefined;
  const unreadCount = await notificationService.getUnreadCount(userId, type);

  response
    .status(200)
    .json(createSuccessResponse({ unreadCount }, "Unread count retrieved"));
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

  const validation = markNotificationAsReadSchema.safeParse(request.body);
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

  const notification = await notificationService.markAsRead(userId, validation.data);
  response
    .status(200)
    .json(createSuccessResponse(notification, "Notification marked as read"));
}

export async function markAllAsRead(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const validation = markAllNotificationsAsReadSchema.safeParse(request.body);
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

  const result = await notificationService.markAllAsRead(userId, validation.data);
  response
    .status(200)
    .json(
      createSuccessResponse(result, `${result.count} notifications marked as read`)
    );
}

export async function deleteNotification(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const notificationId = Array.isArray(request.params.notificationId)
    ? request.params.notificationId[0]
    : request.params.notificationId;
  if (!notificationId) {
    throw new AppError({
      message: "Notification ID is required",
      statusCode: 400,
      code: "MISSING_NOTIFICATION_ID"
    });
  }

  await notificationService.deleteNotification(userId, notificationId);
  response
    .status(200)
    .json(createSuccessResponse({ success: true }, "Notification deleted"));
}

export async function deleteAllNotifications(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const type = request.query.type as string | undefined;
  const result = await notificationService.deleteAllNotifications(userId, type);

  response
    .status(200)
    .json(createSuccessResponse(result, `${result.count} notifications deleted`));
}
