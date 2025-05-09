import { Redis } from 'ioredis';
import { config } from '../../envconfig.js';
import logger from '../lib/logger.js';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    if (times > 3) {
      return null;
    }
    return Math.min(times * 100, 3000);
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => logger.error('Redis: client rrror:', err));
redis.on('connect', () => logger.info('Redis: successfully connected'));

redis.on('reconnecting', () => {
  logger.info('Redis: reconnecting...');
});
