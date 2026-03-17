import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { z } from 'zod';
import { CreateItemSchema, type Item } from '@interview/shared';

type Store = {
  items: Item[];
};

type AppOptions = {
  enableTestRoutes?: boolean;
};

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return Math.random().toString(16).slice(2);
}

export function createApp(
  store: Store = { items: [] },
  options: AppOptions = {},
) {
  const app = express();

  app.use(
    pinoHttp({
      quietReqLogger: true,
      genReqId: () => makeId(),
    }),
  );
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/items', (_req, res) => {
    res.json({ items: store.items });
  });

  app.post('/api/items', (req, res, next) => {
    try {
      const input = CreateItemSchema.parse(req.body);
      const item: Item = { id: makeId(), name: input.name, createdAt: nowIso() };
      store.items.push(item);
      res.status(201).json({ item });
    } catch (err) {
      next(err);
    }
  });

  if (options.enableTestRoutes) {
    app.get('/__test__/boom', () => {
      throw new Error('boom');
    });
  }

  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'not_found', message: 'Not Found' } });
  });

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          error: {
            code: 'bad_request',
            message: 'Invalid request body',
            issues: err.issues,
          },
        });
        return;
      }

      res.status(500).json({
        error: {
          code: 'internal_error',
          message: 'Internal Server Error',
        },
      });
    },
  );

  return app;
}

