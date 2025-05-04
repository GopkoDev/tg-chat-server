import type { Context } from 'hono';
import { getChatsService } from './get-chats.service.js';

export const getChatsController = async (c: Context) => {
  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;

    const chats = await getChatsService({ page, limit });

    if (!chats.success) {
      return c.json({ error: chats.message }, 400);
    }

    return c.json({
      chats: chats.data,
      meta: chats.meta,
    });
  } catch (error) {
    console.error('[GET /chat] Error:', error);
    return c.json({ error: 'Failed to fetch chats' }, 500);
  }
};
