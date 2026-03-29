import React, { useEffect, useMemo, useState } from 'react';

type Item = { id: string; name: string; createdAt: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isItem(value: unknown): value is Item {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.createdAt === 'string'
  );
}

async function fetchItems(): Promise<Item[]> {
  const res = await fetch('/api/items');
  if (!res.ok) throw new Error('failed_to_fetch_items');
  const body: unknown = await res.json();
  const items = isRecord(body) ? body.items : undefined;
  if (!Array.isArray(items)) return [];
  return items.filter(isItem);
}

async function createItem(name: string): Promise<Item> {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('failed_to_create_item');
  const body: unknown = await res.json();
  const item = isRecord(body) ? body.item : undefined;
  if (!isItem(item)) throw new Error('invalid_create_item_response');
  return item;
}

export function ItemsPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const sorted = useMemo(() => {
    if (!items) return null;
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchItems()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load items');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) return;
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
  }

  return (
    <div className="page">
      <h1 className="page__title">Items</h1>

      <form onSubmit={onSubmit} aria-label="create-item-form">
        <label className="form-field" htmlFor="item-name-input">
          New item name
        </label>
        <div className="form-row">
          <input
            id="item-name-input"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. milk"
            aria-label="item-name"
          />
          <button type="submit" className="btn" disabled={creating}>
            {creating ? 'Adding…' : 'Add'}
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" className="alert">
          {error}
        </p>
      ) : null}

      {sorted === null ? (
        <p style={{ marginTop: '1rem' }}>Loading…</p>
      ) : (
        <ul className="item-list">
          {sorted.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span className="muted">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
