import { log } from 'console';
import _ from 'lodash';

import { analyseMessage } from '../helpers/telegram';

const receiveMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id } = _.get(message, 'chat');
    const type = Object.keys(message).slice(-1)[0];
    const content = message[type];

    // log(message);
    // log(id, content, type);

    if (!message)
      throw new Error('[Telegram][Error] Empty message');

    analyseMessage(id, content, type);

    return res.sendStatus(200);
  } catch (error) {
    log(error);
    return res.status(403).send(error);
  }
};

export {
  receiveMessage,
};
