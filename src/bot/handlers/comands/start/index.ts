import { Bot } from 'grammy';
import type { Context } from 'grammy';
import { PrismaClient } from '@prisma/client';

export const startCommand = (bot: Bot<Context>, db: PrismaClient) => {
  bot.command('start', async (ctx) => {
    if (!ctx.from || !ctx.chat || ctx.chat.type !== 'private') return;
    const from = ctx.from;
    const chat = ctx.chat;

    const telegramId = from.id.toString();
    const telegramChatId = chat.id.toString();

    let contact = await db.contact.findUnique({ where: { telegramId } });

    if (!contact) {
      await db.$transaction(async (tx) => {
        const contact = await tx.contact.create({
          data: {
            telegramId,
            firstName: from.first_name,
            lastName: from.last_name,
            userName: from.username,
            languageCode: from.language_code,
          },
        });

        await tx.chat.create({
          data: {
            contactId: contact.id,
            telegramChatId,
            messages: {
              create: {
                senderType: 'CONTACT',
                text: 'Користувач почав взаємодію з ботом',
                date: new Date(),
                isRead: false,
              },
            },
          },
        });
      });
    }

    await ctx.reply('Вітаю! Ви підключені до чату.');
  });
};
