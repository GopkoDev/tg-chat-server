import { Bot, Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import logger from '../../../../lib/logger.js';

type ReactionContext = {
  emojiAdded: string[];
  emojiRemoved: string[];
  messageId: string;
  contactId: string;
};

const handleAddedReactions = async (
  db: PrismaClient,
  { emojiAdded, messageId, contactId }: ReactionContext
): Promise<void> => {
  if (emojiAdded.length === 0) return;

  await db.messageReaction.create({
    data: {
      emoji: emojiAdded[0],
      messageId,
      contactId,
    },
  });
};

const handleUpdatedReactions = async (
  db: PrismaClient,
  { emojiAdded, emojiRemoved, messageId, contactId }: ReactionContext
): Promise<void> => {
  if (emojiAdded.length === 0 || emojiRemoved.length === 0) return;

  await db.messageReaction.upsert({
    where: {
      messageId_contactId_emoji: {
        messageId,
        contactId,
        emoji: emojiRemoved[0],
      },
    },
    update: {
      emoji: emojiAdded[0],
    },
    create: {
      emoji: emojiAdded[0],
      messageId,
      contactId,
    },
  });
};

const handleRemovedReactions = async (
  db: PrismaClient,
  { emojiRemoved, messageId, contactId }: ReactionContext
): Promise<void> => {
  if (emojiRemoved.length === 0) return;

  await db.messageReaction.deleteMany({
    where: {
      emoji: { in: emojiRemoved },
      messageId,
      contactId,
    },
  });
};

export const handleMessageReactions = async (
  bot: Bot<Context>,
  db: PrismaClient
): Promise<void> => {
  bot.on('message_reaction', async (ctx) => {
    try {
      if (!ctx.from) {
        logger.debug('Received reaction without sender data');
        return;
      }

      const userId = ctx.from.id.toString();
      const telegramMessageId = ctx.messageReaction.message_id;

      const chat = await db.chat.findFirst({
        where: {
          contact: {
            telegramId: userId,
          },
        },
        include: {
          contact: true,
        },
      });

      if (!chat) {
        logger.warn(
          `Chat not found for user ${userId} while processing reaction`
        );
        return;
      }

      const { emojiAdded, emojiRemoved } = ctx.reactions();

      const message = await db.message.findFirst({
        where: {
          chatId: chat.id,
          telegramMessageId: telegramMessageId.toString(),
        },
      });

      if (!message) {
        logger.warn(`Message not found for chat ${chat.id}`);
        return;
      }

      const reactionContext: ReactionContext = {
        emojiAdded,
        emojiRemoved,
        messageId: message.id,
        contactId: chat.contact.id,
      };

      if (emojiAdded.length > 0 && emojiRemoved.length === 0) {
        await handleAddedReactions(db, reactionContext);
        return;
      }
      if (emojiAdded.length > 0 && emojiRemoved.length > 0) {
        await handleUpdatedReactions(db, reactionContext);
        return;
      }
      if (emojiAdded.length === 0 && emojiRemoved.length > 0) {
        await handleRemovedReactions(db, reactionContext);
        return;
      }
    } catch (error) {
      logger.error('Error processing reaction on message:', error);
    }
  });
};
