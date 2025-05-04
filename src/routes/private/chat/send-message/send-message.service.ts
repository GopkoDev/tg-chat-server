import { telegramApi } from '../../../../../server.js';
import { db } from '../../../../config/db.js';
import { SenderType } from '@prisma/client';
import type { Message } from '@prisma/client';
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

  try {
    await telegramApi.sendMessage(telegramChatId, text);
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return {
      success: false,
      error: 'Failed to send Telegram message',
    };
  }

  const message = await createMessage(chatId, text, adminId);

  return {
    success: true,
    message,
  };
};

const createMessage = async (
  chatId: string,
  text: string,
  adminId: string
): Promise<Message> => {
  return await db.message.create({
    data: {
      chatId,
      adminId,
      text,
      date: new Date(),
      senderType: SenderType.ADMIN,
      isRead: false,
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
};
