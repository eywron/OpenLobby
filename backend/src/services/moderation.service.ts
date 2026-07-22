import { AppError } from '../errors/app-error';
import * as moderationRepository from '../repositories/moderation.repository';
import type {
  CreateReportInput,
  GetReportsQuery,
  ReviewReportInput,
  SuspendUserInput,
  DeleteContentInput,
} from '../schemas/moderation.schema';

export async function createReport(userId: string, input: CreateReportInput) {
  // Prevent self-reports
  if (input.targetId === userId && input.targetType === 'USER') {
    throw new AppError({
      message: 'You cannot report yourself',
      statusCode: 400,
      code: 'CANNOT_SELF_REPORT',
    });
  }

  return moderationRepository.createReport({
    reporterId: userId,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason,
  });
}

export async function getReports(query: GetReportsQuery) {
  const repoOptions: {
    limit: number;
    skip: number;
    status?: string;
    targetType?: string;
  } = {
    limit: query.limit,
    skip: query.skip,
  };

  if (query.status !== undefined) {
    repoOptions.status = query.status;
  }

  if (query.targetType !== undefined) {
    repoOptions.targetType = query.targetType;
  }

  const reports = await moderationRepository.getReports(repoOptions);

  const total = await moderationRepository.getReportCount(query.status, query.targetType);

  return {
    reports,
    total,
    hasMore: query.skip + query.limit < total,
  };
}

export async function getReportById(reportId: string) {
  const report = await moderationRepository.getReportById(reportId);

  if (!report) {
    throw new AppError({
      message: 'Report not found',
      statusCode: 404,
      code: 'REPORT_NOT_FOUND',
    });
  }

  return report;
}

export async function reviewReport(adminId: string, input: ReviewReportInput) {
  const report = await moderationRepository.getReportById(input.reportId);

  if (!report) {
    throw new AppError({
      message: 'Report not found',
      statusCode: 404,
      code: 'REPORT_NOT_FOUND',
    });
  }

  const repoData: {
    status: string;
    moderationNote?: string;
  } = {
    status: input.status,
  };

  if (input.moderationNote !== undefined) {
    repoData.moderationNote = input.moderationNote;
  }

  const updated = await moderationRepository.reviewReport(input.reportId, repoData);

  // Log the audit action
  await moderationRepository.logAuditAction({
    adminId,
    actionType: 'MODERATION_ACTION',
    targetType: report.targetType,
    targetId: report.targetUserId || report.targetPostId || report.targetCommentId || undefined,
    details: `Report reviewed: ${input.status}`,
  });

  return updated;
}

export async function suspendUser(adminId: string, input: SuspendUserInput) {
  const updated = await moderationRepository.suspendUser(input.userId);

  // Log the audit action
  await moderationRepository.logAuditAction({
    adminId,
    actionType: 'ROLE_CHANGE',
    targetType: 'USER',
    targetId: input.userId,
    details: `User suspended: ${input.reason}`,
  });

  return updated;
}

export async function unsuspendUser(adminId: string, userId: string) {
  const updated = await moderationRepository.unsuspendUser(userId);

  // Log the audit action
  await moderationRepository.logAuditAction({
    adminId,
    actionType: 'ROLE_CHANGE',
    targetType: 'USER',
    targetId: userId,
    details: 'User unsuspended',
  });

  return updated;
}

export async function deleteUser(adminId: string, userId: string, reason: string) {
  const updated = await moderationRepository.deleteUser(userId);

  // Log the audit action
  await moderationRepository.logAuditAction({
    adminId,
    actionType: 'MODERATION_ACTION',
    targetType: 'USER',
    targetId: userId,
    details: `User deleted: ${reason}`,
  });

  return updated;
}

export async function deleteContent(adminId: string, input: DeleteContentInput) {
  let deleted;

  if (input.contentType === 'POST') {
    deleted = await moderationRepository.deletePost(input.contentId);
  } else {
    deleted = await moderationRepository.deleteComment(input.contentId);
  }

  // Log the audit action
  await moderationRepository.logAuditAction({
    adminId,
    actionType: 'MODERATION_ACTION',
    targetType: input.contentType,
    targetId: input.contentId,
    details: `${input.contentType} deleted: ${input.reason}`,
  });

  return deleted;
}

export async function getAuditLogs(options: { limit: number; skip: number; adminId?: string }) {
  const repoOptions: {
    limit: number;
    skip: number;
    adminId?: string;
  } = {
    limit: options.limit,
    skip: options.skip,
  };

  if (options.adminId !== undefined) {
    repoOptions.adminId = options.adminId;
  }

  return moderationRepository.getAuditLogs(repoOptions);
}
