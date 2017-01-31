import axios from 'axios';
// import qs from 'querystring';
import { log } from 'console';
import _ from 'lodash';

const request = axios.create({
  baseURL: 'https://api-botconnector.recast.ai',
  timeout: 1000,
  headers: {
    Authorization: process.env.AUTH_TOKEN,
  },
});

// Call to facebbok to send the message
const sendMessage = async (payload, conversation) => {
  const url = `/users/hqro/bots/589087088058d1537595c16e/conversations/${conversation}/messages`;
  const { status } = await request.post(url, payload);

  if (_.isEqual(status, 200) || _.isEqual(status, 201))
    log('All good job is done');
  else
    throw new Error('Fail to send Facebook message');
};


// Type of message to send back
const replyMessage = async (senderId, content, conversation, type = 'text') => {
  await sendMessage({
      messages: [{ type, content }],
      senderId,
    }, conversation,
  );
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
  sendMessage,
};
