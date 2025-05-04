import { db } from '../../../../config/db.js';

interface GetChatsParams {
  page: number;
  limit: number;
}

interface GetChatsResponse {
  success: boolean;
  message?: string;
  data?: any;
  meta?: {
    totalCount: number;
  };
}

export const getChatsService = async ({
  page,
  limit,
}: GetChatsParams): Promise<GetChatsResponse> => {
  const skip = (page - 1) * limit;

  const [chats, totalCount] = await db.$transaction([
    db.chat.findMany({
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        contact: true,
        messages: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    }),

    db.chat.count(),
  ]);

  if (!chats) {
    return {
      success: false,
      message: 'No chats found',
    };
  }

  return {
    success: true,
    data: chats,
    meta: {
      totalCount,
    },
  };
};
