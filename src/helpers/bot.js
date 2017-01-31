import { replyMessage } from './facebook';
// import { log } from 'console';
import { Client } from 'recastai';
import _ from 'lodash';

import { getClosestStation } from './velib';

const { RECAST_TOKEN, APP_LANG } = process.env;
const client = new Client(RECAST_TOKEN, APP_LANG);

const handleMessage = async ( senderId, message, conversation, type ) => {
  client
    .textConverse(message, {
      conversationToken: senderId,
    })
    .then(async response => {
      const { replies, action, memory } = response;
      // log(replies, action, memory);

      if (action && action.done && !_.isNil(_.get(memory, 'adresse'))) {
        const station = await getClosestStation(memory.adresse.formatted);

        await replyMessage(senderId, `La station la plus proche se trouve au ${station.address}`, conversation);
        await replyMessage(senderId, `Elle est à environ ${station.distance} km d'ici`, conversation);
      }
      await replyMessage(senderId, replies[0], conversation, type);
    })
    .catch(err => {
      console.log(err);
      throw new Error('Client textConverse fail', err);
    });
};

export default handleMessage;
