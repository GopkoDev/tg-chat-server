import { Bot } from 'grammy';
import type { Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import type { Contact } from '@prisma/client';
import { socketService } from '../../../../lib/socket.js';

export const startCommand = (bot: Bot<Context>, db: PrismaClient) => {
  bot.command('start', async (ctx) => {
    if (!ctx.from || !ctx.chat || ctx.chat.type !== 'private') return;
    const from = ctx.from;
    const chat = ctx.chat;

    const telegramId = from.id.toString();
    const telegramChatId = chat.id.toString();

    let contact: Contact | null = await db.contact.findUnique({
      where: { telegramId },
    });
    let isNewContact = false;
    let createdChat;

    if (!contact) {
      isNewContact = true;

      await db.$transaction(
        async (
          tx: Omit<
            PrismaClient,
            | '$connect'
            | '$disconnect'
            | '$on'
            | '$transaction'
            | '$use'
            | '$extends'
          >
        ) => {
          const newContact = await tx.contact.create({
            data: {
              telegramId,
              firstName: from.first_name,
              lastName: from.last_name,
              userName: from.username,
              languageCode: from.language_code,
              isPremium: Boolean(from.is_premium),
            },
          });

          contact = newContact;

          createdChat = await tx.chat.create({
            data: {
              contactId: newContact.id,
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
            include: {
              contact: true,
              messages: true,
            },
          });
        }
      );

      // Emit new user event if this is a new contact
      if (isNewContact && contact) {
        try {
          // @ts-ignore - обходимо проблеми з типізацією
          socketService.emitNewUser({
            user: {
              id: contact.id,
              firstName: contact.firstName,
              lastName: contact.lastName,
              userName: contact.userName,
            },
          });
        } catch (error) {
          console.error('Error emitting new user:', error);
        }
      }
    }

    await ctx.reply('Вітаю! Ви підключені до чату.');
  });
};
