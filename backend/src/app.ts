import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { z } from 'zod';
import { CreateItemSchema, type Item } from '@interview/shared';

/**
 * In-memory store used by the HTTP API.
 */
type Store = {
  readonly items: Item[];
};

/**
 * Options for {@link createApp}.
 */
type AppOptions = {
  /**
   * When true, registers internal routes used only by tests.
   */
  readonly enableTestRoutes?: boolean;
};

/**
 * Returns the current time as an ISO 8601 string.
 */
const nowIso = (): string => new Date().toISOString();

/**
 * Generates a short random identifier for new items and request correlation.
 */
const makeId = (): string => Math.random().toString(16).slice(2);

/**
 * Builds an Express application with items API, health check, and error handling.
 *
 * @param store - Mutable item list the handlers read and write.
 * @param options - Optional feature flags.
 * @returns Configured Express app (not listening).
 */
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
