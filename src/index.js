import 'dotenv/config';
import './config/express';
import { initTelegram } from './config/telegram';

(async () => {
  await initTelegram();
})();

process.on('uncaughtException', error => {
  throw new Error(error, 'Uncaught exception');
});
