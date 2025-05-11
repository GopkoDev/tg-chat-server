import { Bot, Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import { handleTextMessage } from './text/index.js';
import { handleMessageReactions } from './reactions/index.js';

export const registerMessages = async (bot: Bot<Context>, db: PrismaClient) => {
  await handleTextMessage(bot, db);
  await handleMessageReactions(bot, db);
};
