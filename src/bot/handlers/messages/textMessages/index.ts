import { Bot, Context } from 'grammy';
import { PrismaClient } from '@prisma/client';

export const handleTextMessage = async (
  bot: Bot<Context>,
  db: PrismaClient
) => {
  bot.on('message:text', async (ctx) => {
    if (!ctx.from || !ctx.message) return;

    const chat = await db.chat.findFirst({
      where: {
        contact: {
          telegramId: ctx.from.id.toString(),
        },
      },
    });

    if (!chat) {
      await ctx.reply('Чат не знайдено. Натисніть /start.');
      return;
    }

    await db.message.create({
      data: {
        chatId: chat.id,
        senderType: 'CONTACT',
        text: ctx.message.text,
        date: new Date(ctx.message.date * 1000),
        isRead: false,
      },
    });
  });
};
