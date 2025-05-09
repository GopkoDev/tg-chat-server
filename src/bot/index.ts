import { Bot } from 'grammy';
import type { Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import { registerCommands } from './handlers/comands/index.js';
import { registerMessages } from './handlers/messages/index.js';
import logger from '../lib/logger.js';

export const startTelegramBot = async (token: string) => {
  const bot = new Bot<Context>(token);
  const db = new PrismaClient();

  registerCommands(bot, db);
  registerMessages(bot, db);

  bot.catch((err) => {
    logger.error('Bot error:', err);
  });

  try {
    bot.start({
      onStart: (botInfo) => {
        logger.info(`Bot is running as ${botInfo.username}`);
      },
      allowed_updates: [
        'message',
        'edited_message',
        'callback_query',
        'message_reaction',
        'message_reaction_count',
      ],
    });
  } catch (error) {
    logger.error('Failed to start bot', { error });
  }
};
