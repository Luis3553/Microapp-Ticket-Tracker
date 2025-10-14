import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as schema from 'src/db/schema';

export const LabelInsertBase = createInsertSchema(schema.labels);
export const LabelSelectBase = createSelectSchema(schema.labels);

export const LabelCreateSchema = LabelInsertBase.pick({
  name: true,
  color: true,
}).extend({
  name: z.string().min(1).max(40),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'color must be hex like #AABBCC'),
});

export const LabelUpdateSchema = LabelCreateSchema.partial();

export const LabelListQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
});

export type LabelRow = z.infer<typeof LabelSelectBase>;
export type LabelCreateInput = z.infer<typeof LabelCreateSchema>;
export type LabelUpdateInput = z.infer<typeof LabelUpdateSchema>;
export type LabelListQuery = z.infer<typeof LabelListQuerySchema>;
