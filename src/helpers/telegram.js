import _ from 'lodash';
import { log } from 'console';

import { api } from '../config/telegram';

const sendMessage = async (id, text) => {
  const { status } = await api.post('/sendMessage', {
    'chat_id': id,
    text,
  });

  if (!_.isEqual(status, 200))
    throw new Error(`[Telegram][Status ${status}] Cannot send message`);

  return log('[Telegram] Message sent successfully !');
};

const analyseMessage = async (id, content, /* type = 'text' */) => {
  if (_.isUndefined(id))
    throw new Error('[Telegram][Error] Chat iD is missing');

  if (_.isUndefined(content))
    throw new Error('[Telegram][Error] Message has no content');

  // Just send Hello World
  await sendMessage(id, 'Hello World');
};

export {
  analyseMessage,
  sendMessage,
};
