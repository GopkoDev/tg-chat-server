import type { MessageReaction } from '@prisma/client';
import { db } from '../../../../config/db.js';
import { getTelegramApi } from '../../../../config/telegram.js';
interface AddReactionServiceParams {
  telegramMessageId: string;
  telegramChatId: string;
  messageId: string;
  userId: string;
  emoji: string;
}

type AddReactionServiceResponse = {
  success: boolean;
  data?: MessageReaction;
  error?: string;
};

export const addReactionService = async ({
  telegramMessageId,
  telegramChatId,
  messageId,
  userId,
  emoji,
}: AddReactionServiceParams): Promise<AddReactionServiceResponse> => {
  const botApi = getTelegramApi();
  const resp = await botApi.setMessageReaction(
    telegramChatId,
    Number(telegramMessageId),
    [{ type: 'emoji', emoji: emoji as any }]
  );

  if (!resp) {
    return {
      success: false,
      error: 'Failed to add reaction to telegram',
    };
  }

  const reaction = await db.messageReaction.create({
    data: {
      messageId,
      userId,
      emoji,
    },
    include: {
      user: true,
      contact: true,
    },
  });

  if (!reaction) {
    return {
      success: false,
      error: 'Failed to add reaction',
    };
  }

  return {
    success: true,
    data: reaction,
  };
};

interface RemoveReactionServiceParams {
  telegramMessageId: string;
  telegramChatId: string;
  messageId: string;
  userId: string;
  emoji: string;
}

type RemoveReactionServiceResponse = {
  success: boolean;
  error?: string;
};

export const removeReactionService = async ({
  telegramMessageId,
  telegramChatId,
  messageId,
  userId,
  emoji,
}: RemoveReactionServiceParams): Promise<RemoveReactionServiceResponse> => {
  const botApi = getTelegramApi();
  const resp = await botApi.setMessageReaction(
    telegramChatId,
    Number(telegramMessageId),
    []
  );

  if (!resp) {
    return {
      success: false,
      error: 'Failed to remove reaction from telegram',
    };
  }

  const reaction = await db.messageReaction.delete({
    where: {
      messageId_userId_emoji: {
        messageId,
        userId,
        emoji,
      },
    },
  });

  if (!reaction) {
    return {
      success: false,
      error: 'Failed to remove reaction',
    };
  }

  return {
    success: true,
  };
};

interface UpdateReactionServiceParams {
  messageId: string;
  userId: string;
  emoji: string;
  telegramMessageId: string;
  telegramChatId: string;
}

type UpdateReactionServiceResponse = {
  success: boolean;
  data?: MessageReaction;
  error?: string;
};

export const updateReactionService = async ({
  messageId,
  userId,
  emoji,
  telegramMessageId,
  telegramChatId,
}: UpdateReactionServiceParams): Promise<UpdateReactionServiceResponse> => {
  const botApi = getTelegramApi();
  const resp = await botApi.setMessageReaction(
    telegramChatId,
    Number(telegramMessageId),
    [{ type: 'emoji', emoji: emoji as any }]
  );

  if (!resp) {
    return {
      success: false,
      error: 'Failed to update reaction',
    };
  }

  await db.messageReaction.deleteMany({
    where: {
      messageId,
      userId,
    },
  });

  const reaction = await db.messageReaction.create({
    data: {
      messageId,
      userId,
      emoji,
    },
    include: {
      user: true,
      contact: true,
    },
  });

  return {
    success: true,
    data: reaction,
  };
};
