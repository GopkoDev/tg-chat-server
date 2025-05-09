import type { MessageReaction } from '@prisma/client';
import { db } from '../../../../config/db.js';

interface AddReactionServiceParams {
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
  messageId,
  userId,
  emoji,
}: AddReactionServiceParams): Promise<AddReactionServiceResponse> => {
  const reaction = await db.messageReaction.create({
    data: {
      messageId,
      userId,
      emoji,
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
  messageId: string;
  userId: string;
  emoji: string;
}

type RemoveReactionServiceResponse = {
  success: boolean;
  data?: MessageReaction;
  error?: string;
};

export const removeReactionService = async ({
  messageId,
  userId,
  emoji,
}: RemoveReactionServiceParams): Promise<RemoveReactionServiceResponse> => {
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
    data: reaction,
  };
};

interface UpdateReactionServiceParams {
  messageId: string;
  userId: string;
  emoji: string;
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
}: UpdateReactionServiceParams): Promise<UpdateReactionServiceResponse> => {
  const reaction = await db.messageReaction.update({
    where: {
      messageId_userId_emoji: {
        messageId,
        userId,
        emoji,
      },
    },
    data: {
      emoji,
    },
  });

  if (!reaction) {
    return {
      success: false,
      error: 'Failed to update reaction',
    };
  }

  return {
    success: true,
    data: reaction,
  };
};
