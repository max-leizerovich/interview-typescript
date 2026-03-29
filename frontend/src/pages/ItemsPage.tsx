import {
  CreateItemResponseSchema,
  ItemsListResponseSchema,
  type Item,
} from '@interview/shared';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const fetchItems = async (): Promise<Item[]> => {
  const res = await fetch('/api/items');
  if (!res.ok) {
    throw new Error('failed_to_fetch_items');
  }
  const body: unknown = await res.json();
  const parsed = ItemsListResponseSchema.safeParse(body);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.items;
};

const createItem = async (name: string): Promise<Item> => {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error('failed_to_create_item');
  }
  const body: unknown = await res.json();
  const parsed = CreateItemResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new Error('invalid_create_item_response');
  }
  return parsed.data.item;
};

/**
 * Lists items from the API and lets the user add new ones.
 */
export const ItemsPage = () => {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const sorted = useMemo(() => {
    if (!items) {
      return null;
    }
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchItems()
      .then((data) => {
        if (!cancelled) {
          setItems(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load items');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setCreating(true);
    try {
      const item = await createItem(trimmed);
      setItems((prev) => (prev ? [item, ...prev] : [item]));
      setName('');
    } catch {
      setError('Could not create item');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-3 text-3xl font-semibold">Items</h1>

      <form
        onSubmit={handleSubmit}
        aria-label="Create item"
        className="mb-4"
      >
        <label
          className="mb-1.5 block text-sm text-zinc-700 dark:text-zinc-300"
          htmlFor="item-name-input"
        >
          New item name
        </label>
        <div className="flex gap-2">
          <input
            id="item-name-input"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. milk"
            disabled={creating}
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm outline-none transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65 dark:focus-visible:ring-offset-zinc-950"
            disabled={creating}
            aria-busy={creating}
          >
            {creating ? 'Adding…' : 'Add'}
          </button>
        </div>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-3 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}

      {sorted === null ? (
        <p
          className="mt-4 text-zinc-600 dark:text-zinc-400"
          role="status"
          aria-live="polite"
        >
          Loading…
        </p>
      ) : (
        <ul
          className="mt-4 list-disc space-y-1.5 pl-5 text-zinc-900 dark:text-zinc-100"
          aria-label="Items"
        >
          {sorted.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
