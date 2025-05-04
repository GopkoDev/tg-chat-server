import type { Context } from 'hono';
import { markAsReadService } from './mark-as-read.service.js';

export const markAsReadController = async (c: Context) => {
  try {
    const chatId = c.req.param('chatId');

    const result = await markAsReadService({ chatId });

    return c.json({
      success: result.success,
    });
  } catch (error) {
    return c.json({ error: 'Failed to mark messages as read' }, 500);
  }
};
