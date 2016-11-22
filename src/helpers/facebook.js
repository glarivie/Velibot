import axios from 'axios';
import qs from 'query-string';
import { log } from 'console';
import _ from 'lodash';

// Call to facebbok to send the message
const sendMessage = async payload => {
  const { PAGE_ACCESS_TOKEN } = process.env;
  const url = 'https://graph.facebook.com/v2.6/me/messages';
  const token = qs.stringify({ access_token: PAGE_ACCESS_TOKEN });

  const { status } = await axios.post(`${url}?${token}`, payload);

  if (_.isEqual(status, 200))
    log('All good job is done');
  else
    throw new Error('Fail to send Facebook message');
};


// Type of message to send back
const replyMessage = async (id, text) => {
  await sendMessage({ recipient: { id }, message: { text } });
};

const replyButton = async (id, option) => {
  const { elementsTitle, buttonType, buttonUrl, buttonTitle } = option;

  await sendMessage({
    recipient: { id },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: elementsTitle,
            buttons: [{
              type: buttonType,
              url: buttonUrl,
              title: buttonTitle,
            }],
          }],
        },
      },
    },
  });
};

export {
  replyMessage,
  replyButton,
};
