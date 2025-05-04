import type { Context } from 'hono';
import { getChatMessagesService } from './get-messages.service.js';

export const getChatMessagesController = async (c: Context) => {
  try {
    const chatId = c.req.param('chatId');
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;

    const messages = await getChatMessagesService({ chatId, page, limit });

    if (!messages.success) {
      return c.json({ error: messages.message }, 400);
    }

    return c.json({
      messages: messages.data,
      meta: {
        totalCount: messages.meta?.totalCount || 0,
      },
    });
  } catch (error) {
    console.error('[GET /chat/messages] Error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
};
