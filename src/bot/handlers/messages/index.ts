import { Bot, Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import { handleTextMessage } from './textMessages/index.js';

export const registerMessages = async (bot: Bot<Context>, db: PrismaClient) => {
  await handleTextMessage(bot, db);
};
