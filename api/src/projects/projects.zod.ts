import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { projects } from 'src/db/schema';

export const ProjectInsertBase = createInsertSchema(projects);
export const ProjectSelectBase = createSelectSchema(projects);

export const ProjectCreateSchema = ProjectInsertBase.extend({
  key: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[A-Z0-9_-]+$/, 'Use A-Z, 0-9, _ or -'),
  name: z.string().min(2).max(120),
  description: z.string().optional(),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();

export const ProjectListQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
});

export type ProjectRow = z.infer<typeof ProjectSelectBase>;
