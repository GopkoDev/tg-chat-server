import { Hono } from 'hono';
import {
  addReactionController,
  removeReactionController,
  updateReactionController,
} from './message-reactions.controller.js';
import { zodValidator } from '../../../../middlewares/zod-validator.js';
import { reactionSchema } from './message-reactions.schema.js';

const messageReactionsRoutes = new Hono();

messageReactionsRoutes.post(
  '/',
  zodValidator({ body: reactionSchema }),
  addReactionController
);
messageReactionsRoutes.put(
  '/',
  zodValidator({ body: reactionSchema }),
  updateReactionController
);
messageReactionsRoutes.delete(
  '/',
  zodValidator({ body: reactionSchema }),
  removeReactionController
);

export default messageReactionsRoutes;
