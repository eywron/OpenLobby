import { z } from "zod";

export const createReportSchema = z.object({
  targetType: z.enum(["POST", "COMMENT", "USER"]),
  targetId: z.string().uuid("Invalid target ID"),
  reason: z
    .string()
    .min(10, "Report reason must be at least 10 characters")
    .max(1000, "Report reason must be at most 1000 characters")
});

export const getReportsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
  status: z
    .enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"])
    .optional(),
  targetType: z
    .enum(["POST", "COMMENT", "USER"])
    .optional()
});

export const reviewReportSchema = z.object({
  reportId: z.string().uuid("Invalid report ID"),
  status: z.enum(["UNDER_REVIEW", "RESOLVED", "REJECTED"]),
  moderationNote: z
    .string()
    .max(1000, "Moderation note must be at most 1000 characters")
    .optional()
});

export const suspendUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  reason: z
    .string()
    .min(10, "Suspension reason must be at least 10 characters")
    .max(500, "Suspension reason must be at most 500 characters")
});

export const deleteContentSchema = z.object({
  contentType: z.enum(["POST", "COMMENT"]),
  contentId: z.string().uuid("Invalid content ID"),
  reason: z
    .string()
    .min(10, "Deletion reason must be at least 10 characters")
    .max(500, "Deletion reason must be at most 500 characters")
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type GetReportsQuery = z.infer<typeof getReportsQuerySchema>;
export type ReviewReportInput = z.infer<typeof reviewReportSchema>;
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;
export type DeleteContentInput = z.infer<typeof deleteContentSchema>;
