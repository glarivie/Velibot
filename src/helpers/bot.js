import { replyMessage, replyButton } from './facebook';
import { log } from 'console';
import { Client } from 'recastai';
import _ from 'lodash';

import { getClosestStation } from './velib';

const { RECAST_TOKEN, APP_LANG } = process.env;
const client = new Client(RECAST_TOKEN, APP_LANG);

const handleMessage = async ({ sender, message }) => {
  if (_.has(message, 'text')) {
    client
      .textConverse(message.text, {
        conversationToken: sender.id,
      })
      .then(async response => {
        const { reply, replies, action, memory } = response;
        log(replies, action, memory);

        if (!reply()) {
          await replyButton(sender.id, {
            messageText: null,
            buttonTitle: 'My first button',    /* Option of your button. */
            buttonUrl: 'https://recast.ai/',   /* If you like more option check out ./facebook.js the function replyButton, and look up */
            buttonType: 'web_url',             /* the facebook doc for button https://developers.facebook.com/docs/messenger-platform/send-api-reference#message */
            elementsTitle: 'I don\'t get it :(',
          });
        } else {
          if (action && action.done && !_.isNil(_.get(memory, 'adresse'))) {
            const station = await getClosestStation(memory.adresse.formatted);

            await replyMessage(sender.id, `La station la plus proche se trouve au ${station.address}`);
            await replyMessage(sender.id, `Elle est à environ ${station.distance} km d'ici`);
          }

          // await Promise.all(replies.map(async rep =>
          //   await replyMessage(sender.id, rep)
          // ));
          await replyMessage(sender.id, replies[0]);
        }
      })
      .catch(err => {
        throw new Error('Client textConverse fail', err);
      });
  } else if (_.has(message, 'attachments')) {
    await replyMessage(sender.id, 'Message with attachment received');
  }
};

export default handleMessage;
