import type { Context } from 'hono';
import logger from '../../../../lib/logger.js';
import {
  addReactionService,
  removeReactionService,
  updateReactionService,
} from './message-reactions.service.js';

export const addReactionController = async (c: Context) => {
  try {
    const messageId = c.req.param('messageId');
    const userId = c.get('userId');
    const { emoji } = c.get('validator').body;

    const response = await addReactionService({
      messageId,
      userId,
      emoji,
    });

    if (!response.success) {
      return c.json({ error: response.error }, 500);
    }

    const { data, success } = response;

    return c.json({ data, success });
  } catch (error) {
    logger.error('MESSAGE / POST / REACTIONS ERROR', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export const removeReactionController = async (c: Context) => {
  try {
    const messageId = c.req.param('messageId');
    const userId = c.get('userId');
    const { emoji } = c.get('validator').body;

    const response = await removeReactionService({
      messageId,
      userId,
      emoji,
    });

    if (!response.success) {
      return c.json({ error: response.error }, 500);
    }

    const { data, success } = response;

    return c.json({ data, success });
  } catch (error) {
    logger.error('MESSAGE / DELETE / REACTIONS ERROR', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export const updateReactionController = async (c: Context) => {
  try {
    const messageId = c.req.param('messageId');
    const userId = c.get('userId');
    const { emoji } = c.get('validator').body;

    const response = await updateReactionService({
      messageId,
      userId,
      emoji,
    });

    if (!response.success) {
      return c.json({ error: response.error }, 500);
    }

    const { data, success } = response;

    return c.json({ data, success });
  } catch (error) {
    logger.error('MESSAGE / PUT / REACTIONS ERROR', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
