import { z } from "zod";

export const getNotificationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  skip: z.coerce.number().int().min(0).default(0),
  type: z
    .enum(["LIKE", "COMMENT", "REPLY", "FOLLOW", "MENTION"])
    .optional(),
  unreadOnly: z.coerce.boolean().default(false)
});

export const markNotificationAsReadSchema = z.object({
  notificationId: z.string().uuid("Invalid notification ID")
});

export const markAllNotificationsAsReadSchema = z.object({
  type: z
    .enum(["LIKE", "COMMENT", "REPLY", "FOLLOW", "MENTION"])
    .optional()
});

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;
export type MarkNotificationAsReadInput = z.infer<typeof markNotificationAsReadSchema>;
export type MarkAllNotificationsAsReadInput = z.infer<typeof markAllNotificationsAsReadSchema>;
