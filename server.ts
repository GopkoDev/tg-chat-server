import { serve } from '@hono/node-server';
import app from './src/app.js';
import { config } from './envconfig.js';
import { startTelegramBot } from './src/bot/index.js';

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

export const telegramApi = await startTelegramBot(config.telegram.botToken);
