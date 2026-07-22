import { z } from 'zod';

export const startConversationSchema = z.object({
  targetUserId: z.string().uuid('Invalid user ID'),
});

export const sendMessageSchema = z
  .object({
    textContent: z.string().max(5000).optional(),
    attachmentType: z.enum(['IMAGE']).optional(),
    attachmentUrl: z.string().url().optional(),
  })
  .refine((data) => data.textContent || data.attachmentUrl, {
    message: 'Message must contain text or an attachment',
  });

export const getMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>;
