import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be at most 100 characters')
    .optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').nullable().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').nullable().optional(),
  bannerUrl: z.string().url('Invalid banner URL').nullable().optional(),
});

export const updateSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  directMessageNotifications: z.boolean().optional(),
  privacyProfilePublic: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
