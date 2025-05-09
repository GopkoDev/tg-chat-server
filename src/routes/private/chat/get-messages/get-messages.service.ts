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
