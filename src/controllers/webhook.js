import { log } from 'console';
import _ from 'lodash';

import handleMessage from '../helpers/bot';

const validateWebhook = (req, res) => {
  try {
    const mode = _.get(req.query, 'hub.mode');
    const token = _.get(req.query, 'hub.verify_token');
    const challenge = _.get(req.query, 'hub.challenge');
    const { WEBHOOK_TOKEN } = process.env;

    if (_.isNil(mode))
      throw new Error('[validateWebhook] Mode is missing.');
    if (_.isNil(token))
      throw new Error('[validateWebhook] Token is missing.');

    if (_.isEqual(mode, 'subscribe') && _.isEqual(token, WEBHOOK_TOKEN)) {
      log('Validating webhook...');
      return res.status(200).send(challenge);
    }

    throw new Error('[validateWebhook] Make sure the validation tokens match.');
  } catch (error) {
    return res.status(403).send(error);
  }
};

const analyseMessage = async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const { conversation, attachment } = message;
    const { content, type } = attachment;

    if (_.isUndefined(content))
      throw new Error('[analyseMessage] Empty content.');

    await handleMessage(senderId, content, conversation, type);

    return res.sendStatus(200);
  } catch (error) {
    log(error);
    return res.status(403).send(error);
  }
};

export {
  validateWebhook,
  analyseMessage,
};
