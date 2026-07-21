import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(5000, "Post content must be at most 5000 characters"),
  visibility: z
    .enum(["PUBLIC", "FOLLOWERS", "PRIVATE"])
    .default("PUBLIC"),
  images: z
    .array(z.object({
      url: z.string().url("Invalid image URL"),
      alt: z.string().max(200).optional()
    }))
    .max(10, "Maximum 10 images per post")
    .optional()
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(5000, "Post content must be at most 5000 characters")
    .optional(),
  visibility: z
    .enum(["PUBLIC", "FOLLOWERS", "PRIVATE"])
    .optional()
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment content must be at most 1000 characters")
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
