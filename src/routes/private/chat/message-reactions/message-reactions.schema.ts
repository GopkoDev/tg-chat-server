import { z } from 'zod';

export const reactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required'),
});
