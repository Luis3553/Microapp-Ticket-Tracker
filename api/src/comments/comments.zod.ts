import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import * as schema from 'src/db/schema';

export const CommentSelectBase = createSelectSchema(schema.comments);

export const CommentCreateSchema = z.object({
  body: z.string().min(1).max(10_000),
});

export const CommentListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
});

export type CommentRow = z.infer<typeof CommentSelectBase>;
export type CommentCreateInput = z.infer<typeof CommentCreateSchema>;
export type CommentListQuery = z.infer<typeof CommentListQuerySchema>;
