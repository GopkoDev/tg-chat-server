import { Bot, Context } from 'grammy';
import { PrismaClient, SenderType } from '@prisma/client';
import logger from '../../../../lib/logger.js';
import { socketService } from '../../../../lib/socket.js';

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
      include: {
        contact: true,
      },
    });

    if (!chat) {
      await ctx.reply('Чат не знайдено. Натисніть /start.');
      return;
    }

    try {
      let createdMessage;

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
          createdMessage = await tx.message.create({
            data: {
              chatId: chat.id,
              senderType: 'CONTACT' as SenderType,
              text: ctx.message.text,
              date: new Date(ctx.message.date * 1000),
              isRead: false,
              telegramMessageId: ctx.message.message_id.toString(),
            },
            include: {
              reactions: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      photoUrl: true,
                    },
                  },
                  contact: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      photoUrl: true,
                    },
                  },
                },
              },
            },
          });

          await tx.chat.update({
            where: { id: chat.id },
            data: { updatedAt: new Date() },
          });
        }
      );

      // Emit message via socket.io
      if (createdMessage) {
        socketService.emitNewMessage({
          chatId: chat.id,
          message: createdMessage,
        });
      }
    } catch (error: any) {
      logger.error(
        `Error saving message: ${error?.message || 'Unknown error'}`
      );
    }
  });
};
