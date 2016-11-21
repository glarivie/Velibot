import { replyMessage, replyButton } from './facebook';
import { log } from 'console';
import { Client } from 'recastai';
import _ from 'lodash';

const { RECAST_TOKEN, APP_LANG } = process.env;
const client = new Client(RECAST_TOKEN, APP_LANG);

const handleMessage = async ({ sender, message }) => {
  if (_.has(message, 'text')) {
    client
      .textConverse(message.text, {
        conversationToken: sender.id,
      })
      .then(async response => {
        log(response);
        const { replies, action } = response;

        if (!response.reply()) {
          await replyButton(sender.id, {
            messageText: null,
            buttonTitle: 'My first button',    /* Option of your button. */
            buttonUrl: 'https://recast.ai/',   /* If you like more option check out ./facebook.js the function replyButton, and look up */
            buttonType: 'web_url',             /* the facebook doc for button https://developers.facebook.com/docs/messenger-platform/send-api-reference#message */
            elementsTitle: 'I don\'t get it :(',
          });
        } else {
          if (_.get(action, 'done', false))
            log('Action is done !');

          await Promise.all(replies.map(async rep =>
            await replyMessage(sender.id, rep)
          ));
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
