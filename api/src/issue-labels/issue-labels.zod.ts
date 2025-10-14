import { z } from 'zod';

export const AttachLabelSchema = z.object({
  labelId: z.number().int().positive(),
});

export type AttachLabelInput = z.infer<typeof AttachLabelSchema>;
