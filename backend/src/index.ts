/**
 * Boots the Express backend and starts listening for HTTP connections.
 */

import { createApp } from './app';

const port = Number(process.env.PORT ?? 3001);

const app = createApp();

app.listen(port, () => {
  console.log(`backend listening on http://localhost:${port}`);
});
