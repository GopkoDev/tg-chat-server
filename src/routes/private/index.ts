import { Hono } from 'hono';
import { authMiddleware } from '../../middlewares/auth-middleware.js';

import userRoutes from './user/user.routes.js';
import twoFactorRoutes from './two-factor/two-factor.routes.js';
import chatRoutes from './chat/index.js';

const privateRoutes = new Hono();

privateRoutes.use('*', authMiddleware);

privateRoutes.route('/user', userRoutes);
privateRoutes.route('/two-factor', twoFactorRoutes);
privateRoutes.route('/chat', chatRoutes);

export { privateRoutes };
