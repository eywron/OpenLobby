import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(['users', 'posts', 'hashtags']).default('users'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  skip: z.coerce.number().int().min(0).default(0),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
