import { db } from '../../../../config/db.js';
import { PrismaClient } from '@prisma/client';
import type { Message } from '@prisma/client';
import { getTelegramApi } from '../../../../config/telegram.js';
import logger from '../../../../lib/logger.js';

// Using string literals instead of enum due to type conflicts
type SenderType = 'CONTACT' | 'ADMIN';
const SenderType = {
  ADMIN: 'ADMIN' as SenderType,
  CONTACT: 'CONTACT' as SenderType,
};

interface SendMessageServiceParams {
  chatId: string;
  text: string;
  adminId: string;
}

interface SendMessageServiceResponse {
  success: boolean;
  error?: string;
  message?: Message;
}
export const sendMessageService = async ({
  chatId,
  text,
  adminId,
}: SendMessageServiceParams): Promise<SendMessageServiceResponse> => {
  const chat = await db.chat.findUnique({
    where: { id: chatId },
    include: { contact: true },
  });

  const telegramChatId = Number(chat?.telegramChatId);

  if (!chat || !telegramChatId) {
    return {
      success: false,
      error: 'Chat not found',
    };
  }

  let telegramMessageId: string | undefined;
  try {
    const telegramApi = getTelegramApi();
    const sentMessage = await telegramApi.sendMessage(telegramChatId, text);
    telegramMessageId = sentMessage.message_id.toString();
  } catch (error) {
    logger.error('Failed to send Telegram message:', error);
    return {
      success: false,
      error: 'Failed to send Telegram message',
    };
  }

  const message = await createMessage(chatId, text, adminId, telegramMessageId);

  return {
    success: true,
    message,
  };
};

const createMessage = async (
  chatId: string,
  text: string,
  adminId: string,
  telegramMessageId?: string
): Promise<Message> => {
  return await db.$transaction(
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
      const message = await tx.message.create({
        data: {
          chatId,
          adminId,
          text,
          date: new Date(),
          senderType: SenderType.ADMIN,
          isRead: false,
          telegramMessageId,
        },
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
            },
          },
        },
      });

      await tx.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      return message;
    }
  );
};
