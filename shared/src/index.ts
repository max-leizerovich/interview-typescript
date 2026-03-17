import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type Item = z.infer<typeof ItemSchema>;

export const CreateItemSchema = z.object({
  name: z.string().min(1),
});

export type CreateItemInput = z.infer<typeof CreateItemSchema>;

