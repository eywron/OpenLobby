import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error';
import { createSuccessResponse, createErrorResponse } from '../utils/api-response';
import {
  createReportSchema,
  getReportsQuerySchema,
  reviewReportSchema,
  suspendUserSchema,
  deleteContentSchema,
} from '../schemas/moderation.schema';
import * as moderationService from '../services/moderation.service';

export async function createReport(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const validation = createReportSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const report = await moderationService.createReport(userId, validation.data);
  response.status(201).json(createSuccessResponse(report, 'Report created'));
}

export async function getReports(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const validation = getReportsQuerySchema.safeParse(request.query);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const result = await moderationService.getReports(validation.data);
  response.status(200).json(createSuccessResponse(result, 'Reports retrieved'));
}

export async function getReportById(request: Request, response: Response): Promise<void> {
  const reportId = Array.isArray(request.params.reportId)
    ? request.params.reportId[0]
    : request.params.reportId;
  if (!reportId) {
    throw new AppError({
      message: 'Report ID is required',
      statusCode: 400,
      code: 'MISSING_REPORT_ID',
    });
  }

  const report = await moderationService.getReportById(reportId);
  response.status(200).json(createSuccessResponse(report, 'Report retrieved'));
}

export async function reviewReport(request: Request, response: Response): Promise<void> {
  const adminId = request.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const validation = reviewReportSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const report = await moderationService.reviewReport(adminId, validation.data);
  response.status(200).json(createSuccessResponse(report, 'Report reviewed'));
}

export async function suspendUser(request: Request, response: Response): Promise<void> {
  const adminId = request.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const validation = suspendUserSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const user = await moderationService.suspendUser(adminId, validation.data);
  response.status(200).json(createSuccessResponse(user, 'User suspended'));
}

export async function unsuspendUser(request: Request, response: Response): Promise<void> {
  const adminId = request.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const userId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!userId) {
    throw new AppError({
      message: 'User ID is required',
      statusCode: 400,
      code: 'MISSING_USER_ID',
    });
  }

  const user = await moderationService.unsuspendUser(adminId, userId);
  response.status(200).json(createSuccessResponse(user, 'User unsuspended'));
}

export async function deleteUser(request: Request, response: Response): Promise<void> {
  const adminId = request.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const userId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!userId) {
    throw new AppError({
      message: 'User ID is required',
      statusCode: 400,
      code: 'MISSING_USER_ID',
    });
  }

  const reason = request.body.reason as string;
  if (!reason) {
    throw new AppError({
      message: 'Deletion reason is required',
      statusCode: 400,
      code: 'MISSING_REASON',
    });
  }

  const user = await moderationService.deleteUser(adminId, userId, reason);
  response.status(200).json(createSuccessResponse(user, 'User deleted'));
}

export async function deleteContent(request: Request, response: Response): Promise<void> {
  const adminId = request.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const validation = deleteContentSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const content = await moderationService.deleteContent(adminId, validation.data);
  response.status(200).json(createSuccessResponse(content, 'Content deleted'));
}

export async function getAuditLogs(request: Request, response: Response): Promise<void> {
  const adminId = request.user?.userId;
  if (!adminId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const limit = Math.min(parseInt(request.query.limit as string) || 20, 100);
  const skip = Math.max(parseInt(request.query.skip as string) || 0, 0);
  const filterAdminId = request.query.adminId as string | undefined;

  const serviceOptions: {
    limit: number;
    skip: number;
    adminId?: string;
  } = {
    limit,
    skip,
  };

  if (filterAdminId !== undefined) {
    serviceOptions.adminId = filterAdminId;
  }

  const logs = await moderationService.getAuditLogs(serviceOptions);

  response.status(200).json(createSuccessResponse(logs, 'Audit logs retrieved'));
}
