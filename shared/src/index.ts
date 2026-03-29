import { z } from 'zod';

/**
 * Zod schema for a persisted item returned by the API.
 */
export const ItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
});

/**
 * Inferred TypeScript type for {@link ItemSchema}.
 */
export type Item = z.infer<typeof ItemSchema>;

/**
 * Zod schema for the request body when creating an item.
 */
export const CreateItemSchema = z.object({
  name: z.string().min(1),
});

/**
 * Inferred TypeScript type for {@link CreateItemSchema}.
 */
export type CreateItemInput = z.infer<typeof CreateItemSchema>;

/**
 * Zod schema for the JSON body of `GET /api/items`.
 */
export const ItemsListResponseSchema = z.object({
  items: z.array(ItemSchema),
});

/**
 * Inferred TypeScript type for {@link ItemsListResponseSchema}.
 */
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

/**
 * Zod schema for the JSON body of `POST /api/items` on success.
 */
export const CreateItemResponseSchema = z.object({
  item: ItemSchema,
});

/**
 * Inferred TypeScript type for {@link CreateItemResponseSchema}.
 */
export type CreateItemResponse = z.infer<typeof CreateItemResponseSchema>;
