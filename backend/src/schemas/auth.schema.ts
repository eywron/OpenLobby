import { z } from "zod";

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const RESERVED_USERNAMES = ["admin", "root", "system", "api", "bot", "openlobby"];

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(USERNAME_PATTERN, "Username can only contain letters, numbers, hyphens, and underscores")
    .refine(
      (val) => !RESERVED_USERNAMES.includes(val.toLowerCase()),
      "This username is reserved"
    ),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be at most 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .refine((val) => !/^\s+$/.test(val), "Password cannot be only whitespace")
    .refine(
      (val) => /[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val),
      "Password must contain uppercase, lowercase, and numbers"
    )
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false)
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .refine((val) => !/^\s+$/.test(val), "Password cannot be only whitespace")
    .refine(
      (val) => /[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val),
      "Password must contain uppercase, lowercase, and numbers"
    )
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
