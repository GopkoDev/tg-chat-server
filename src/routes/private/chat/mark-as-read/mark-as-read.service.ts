import { SenderType } from '@prisma/client';
import { db } from '../../../../config/db.js';

interface MarkAsReadServiceParams {
  chatId: string;
}

interface MarkAsReadServiceResponse {
  success: boolean;
}

export const markAsReadService = async ({
  chatId,
}: MarkAsReadServiceParams): Promise<MarkAsReadServiceResponse> => {
  await db.message.updateMany({
    where: {
      chatId,
      isRead: false,
      senderType: SenderType.CONTACT,
    },
    data: {
      isRead: true,
    },
  });

  return {
    success: true,
  };
};
