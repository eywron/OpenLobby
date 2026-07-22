import { z } from 'zod';

export const syncUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  displayName: z
    .string()
    .min(1, 'Display name cannot be empty')
    .max(100, 'Display name must not exceed 100 characters')
    .optional(),
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;

export const deleteAccountSchema = z
  .object({
    confirmation: z.literal('DELETE').optional(),
  })
  .optional();

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
