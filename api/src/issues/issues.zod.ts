import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as schema from 'src/db/schema';

export const IssueInsertBase = createInsertSchema(schema.issues);
export const IssueSelectBase = createSelectSchema(schema.issues);

export const IssueCreateSchema = IssueInsertBase.pick({
  projectId: true,
  title: true,
  description: true,
  assigneeId: true,
  priority: true,
}).extend({
  title: z.string().min(2).max(255),
  priority: z.enum(['low', 'medium', 'high']).default('medium').optional(),
  description: z.string().optional(),
  assigneeId: z.number().int().positive().optional(),
});

export const IssueUpdateSchema = IssueInsertBase.partial()
  .pick({
    title: true,
    description: true,
    status: true,
    assigneeId: true,
    priority: true,
  })
  .extend({
    title: z.string().min(2).max(255).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    description: z.string().optional(),
    assigneeId: z.number().int().positive().nullable().optional(),
  });

export const IssueListQuerySchema = z.object({
  q: z.string().optional(),
  projectId: z.coerce.number().int().positive().optional(),
  reporterId: z.coerce.number().int().positive().optional(),
  assigneeId: z.coerce.number().int().positive().optional(),
  status: z
    .enum(['open', 'in_progress', 'blocked', 'done', 'closed'])
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
});

export type IssueRow = z.infer<typeof IssueSelectBase>;
export type IssueCreateInput = z.infer<typeof IssueCreateSchema>;
export type IssueUpdateInput = z.infer<typeof IssueUpdateSchema>;
export type IssueListQuery = z.infer<typeof IssueListQuerySchema>;
