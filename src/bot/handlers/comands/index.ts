import { Bot, Context } from 'grammy';
import { startCommand } from './start/index.js';
import { PrismaClient } from '@prisma/client';

export const registerCommands = (bot: Bot<Context>, db: PrismaClient) => {
  startCommand(bot, db);
};
