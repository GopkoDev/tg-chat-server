import type { Context } from 'hono';
import { sendMessageService } from './send-message.service.js';

export const sendMessageController = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const chatId = c.req.param('chatId');
    const { text } = c.get('validator').body;

    const result = await sendMessageService({
      chatId,
      text,
      adminId: userId,
    });

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error('[SEND MESSAGE] Error: ', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
};
