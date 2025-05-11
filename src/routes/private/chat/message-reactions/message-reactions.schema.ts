import { z } from 'zod';

export const reactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required'),
  messageId: z.string().min(1, 'Message ID is required'),
  telegramMessageId: z.string().min(1, 'Telegram Message ID is required'),
  telegramChatId: z.string().min(1, 'Telegram Chat ID is required'),
});
