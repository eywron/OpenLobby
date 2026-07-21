import { prisma } from "../lib/prisma";

export async function createReport(data: {
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
}) {
  return prisma.report.create({
    data: {
      reporterId: data.reporterId,
      targetType: data.targetType as "POST" | "COMMENT" | "USER",
      targetId: data.targetId,
      reason: data.reason,
      status: "OPEN"
    },
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
}

export async function getReports(options: {
  limit: number;
  skip: number;
  status?: string;
  targetType?: string;
}) {
  const where: {
    status?: string;
    targetType?: string;
  } = {};

  if (options.status) {
    where.status = options.status;
  }

  if (options.targetType) {
    where.targetType = options.targetType;
  }

  return prisma.report.findMany({
    where,
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      targetUser: {
        select: {
          id: true,
          username: true,
          email: true,
          accountStatus: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: options.limit,
    skip: options.skip
  });
}

export async function getReportCount(status?: string, targetType?: string) {
  return prisma.report.count({
    where: {
      ...(status && { status }),
      ...(targetType && { targetType })
    }
  });
}

export async function getReportById(reportId: string) {
  return prisma.report.findUnique({
    where: { id: reportId },
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      targetUser: {
        select: {
          id: true,
          username: true,
          email: true,
          accountStatus: true
        }
      }
    }
  });
}

export async function reviewReport(
  reportId: string,
  data: {
    status: string;
    moderationNote?: string;
  }
) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      status: data.status as "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED",
      moderationNote: data.moderationNote,
      reviewedAt: new Date()
    },
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
}

export async function suspendUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: "SUSPENDED"
    }
  });
}

export async function unsuspendUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: "ACTIVE"
    }
  });
}

export async function deleteUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: "DELETED",
      deletedAt: new Date()
    }
  });
}

export async function deletePost(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      deletedAt: new Date()
    }
  });
}

export async function deleteComment(commentId: string) {
  return prisma.comment.update({
    where: { id: commentId },
    data: {
      deletedAt: new Date()
    }
  });
}

export async function logAuditAction(data: {
  adminId: string;
  actionType: string;
  targetType?: string;
  targetId?: string;
  details?: string;
}) {
  return prisma.auditLog.create({
    data: {
      adminId: data.adminId,
      actionType: data.actionType as "LOGIN" | "LOGOUT" | "ROLE_CHANGE" | "MODERATION_ACTION" | "PASSWORD_CHANGE" | "ACCOUNT_DELETION",
      targetType: data.targetType,
      targetId: data.targetId,
      details: data.details
    }
  });
}

export async function getAuditLogs(options: {
  limit: number;
  skip: number;
  adminId?: string;
}) {
  return prisma.auditLog.findMany({
    where: {
      ...(options.adminId && { adminId: options.adminId })
    },
    include: {
      admin: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: options.limit,
    skip: options.skip
  });
}
