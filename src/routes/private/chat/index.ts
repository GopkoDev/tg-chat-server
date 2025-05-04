import { Hono } from 'hono';
import { getChatsController } from './get-chats/get-chats.controller.js';
import { getChatMessagesController } from './get-messages/get-messages.controller.js';
import { markAsReadController } from './mark-as-read/mark-as-read.controller.js';
import { sendMessageController } from './send-message/send-message.controller.js';
import { zodValidator } from '../../../middlewares/zod-validator.js';
import { sendMessageSchema } from './send-message/send-message.schema.js';

const chatRoutes = new Hono();

chatRoutes.get('/', getChatsController);
chatRoutes.get('/:chatId/messages', getChatMessagesController);
chatRoutes.post('/:chatId/read', markAsReadController);
chatRoutes.post(
  '/:chatId/messages',
  zodValidator({ body: sendMessageSchema }),
  sendMessageController
);

export default chatRoutes;
