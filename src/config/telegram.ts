import { Bot } from 'grammy';
import { config } from '../../envconfig.js';
let telegramApi: Bot['api'] | null = null;

export const initTelegramApi = async () => {
  if (!telegramApi) {
    const bot = new Bot(config.telegram.botToken);
    await bot.init();
    telegramApi = bot.api;
  }
  return telegramApi;
};

export const getTelegramApi = () => {
  if (!telegramApi) {
    throw new Error('Telegram API not initialized');
  }
  return telegramApi;
};
