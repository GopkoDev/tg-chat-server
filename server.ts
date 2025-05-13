import { serve } from '@hono/node-server';
import app from './src/app.js';
import { config } from './envconfig.js';
import { startTelegramBot } from './src/bot/index.js';
import { initTelegramApi } from './src/config/telegram.js';
import logger from './src/lib/logger.js';
import { socketService } from './src/lib/socket.js';
import type { Server as HTTPServer } from 'node:http';

await initTelegramApi();

await startTelegramBot(config.telegram.botToken);

const server = serve(
  {
    fetch: app.fetch,
    port: config.server.port,
    hostname: config.server.hostname,
  },
  (info) => {
    logger.info(`Server is running on http://${info.address}:${info.port}`);
  }
);

socketService.initializeSocket(server as HTTPServer);
