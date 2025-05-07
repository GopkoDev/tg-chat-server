import { Bot } from 'grammy';
import { config } from '../../envconfig.js';
import { PrismaClient } from '@prisma/client';
import { registerCommands } from './handlers/comands/index.js';
import { registerMessages } from './handlers/messages/index.js';
import logger from '../lib/logger.js';

const isProduction = config.server.nodeEnv === 'production';

export const startTelegramBot = async (token: string) => {
  const bot = new Bot(token);
  const db = new PrismaClient();

  registerCommands(bot, db);
  registerMessages(bot, db);

  bot.catch((err) => {
    logger.error('Bot error:', err);
  });

  try {
    if (!isProduction) {
      bot.start({
        onStart: (botInfo) => {
          console.log(`Bot is running as ${botInfo.username}`);
        },
      });
    } else {
      // TODO: set webhook in production environment
    }
  } catch (error) {
    logger.error('Failed to start bot', { error });
  }
};
