import axios from 'axios';
import _ from 'lodash';
import { log, error } from 'console';

const { TELEGRAM_TOKEN, NGROK_URL } = process.env;
const api = axios.create({
  baseURL: `https://api.telegram.org/bot${TELEGRAM_TOKEN}`,
  timeout: 3000,
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const setWebhook = async () => {
  try {
    const { status, data } = await api.post('/setWebhook', {
      url: `${NGROK_URL}/telegram`,
    });

    if (!_.isEqual(status, 200))
      throw new Error(`[Telegram][Status ${status}] Cannot set Webhook`);

    return log(`[Telegram] ${data.description}`);
  } catch (err) {
    error(err);
  }
};

const initTelegram = async () => {
  try {
    const { data, status } = await api.get('/getWebhookInfo');

    if (_.isUndefined(status) || !_.isEqual(status, 200))
      throw new Error(`[Telegram][Status ${status}] Error with getWebhookInfo method`);

    if (!_.isEmpty(_.get(data, 'result.url', null)))
      return log('[Telegram] Webhook already defined');

    return setWebhook();
  } catch (err) {
    error(err);
  }
};

export {
  initTelegram,
  api,
};
