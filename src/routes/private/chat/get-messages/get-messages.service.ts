import { db } from '../../../../config/db.js';

interface GetChatMessagesParams {
  chatId: string;
  page: number;
  limit: number;
}

interface GetChatMessagesResponse {
  success: boolean;
  message?: string;
  data?: any;
  meta?: {
    totalCount: number;
  };
}

export const getChatMessagesService = async ({
  chatId,
  page,
  limit,
}: GetChatMessagesParams): Promise<GetChatMessagesResponse> => {
  const skip = (page - 1) * limit;

  const [messages, totalCount] = await db.$transaction([
    db.message.findMany({
      where: {
        chatId,
      },
      skip,
      take: limit,
      orderBy: {
        date: 'desc',
      },
    }),
    db.message.count({
      where: {
        chatId,
      },
    }),
  ]);

  if (!messages) {
    return {
      success: false,
      message: 'No messages found',
    };
  }

  return {
    success: true,
    data: messages,
    meta: {
      totalCount,
    },
  };
};
