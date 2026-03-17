import request from 'supertest';
import { createApp } from './app';

describe('backend API', () => {
  test('GET /health returns ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('GET /api/items returns empty list initially', async () => {
    const app = createApp();
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [] });
  });

  test('POST /api/items validates body', async () => {
    const app = createApp();
    const res = await request(app).post('/api/items').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('bad_request');
  });

  test('POST /api/items creates and returns item', async () => {
    const app = createApp();
    const res = await request(app).post('/api/items').send({ name: 'milk' });
    expect(res.status).toBe(201);
    expect(res.body.item.name).toBe('milk');
    expect(typeof res.body.item.id).toBe('string');
    expect(typeof res.body.item.createdAt).toBe('string');

    const list = await request(app).get('/api/items');
    expect(list.body.items).toHaveLength(1);
    expect(list.body.items[0].name).toBe('milk');
  });

  test('unknown route returns 404', async () => {
    const app = createApp();
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  test('unhandled error returns 500', async () => {
    const app = createApp(undefined, { enableTestRoutes: true });
    const res = await request(app).get('/__test__/boom');
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('internal_error');
  });
});

