import { serve } from '@hono/node-server';
import app from './src/app.js';
import { config } from './envconfig.js';
import { startTelegramBot } from './src/bot/index.js';
import { initTelegramApi } from './src/config/telegram.js';

await initTelegramApi();

await startTelegramBot(config.telegram.botToken);

serve(
  {
    fetch: app.fetch,
    port: config.server.port,
    hostname: config.server.hostname,
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  }
);
