import { Client } from 'recastai'
import convert from 'convert-units'
import _ from 'lodash'

import { getClosestStation } from './velib'
import { reply } from './botConnector'

const { RECAST_TOKEN, APP_LANG } = process.env
const client = new Client(RECAST_TOKEN, APP_LANG)

const handleMessage = async (senderId, { conversation, attachment: { content, type } }) => {
  client
    .textConverse(content, { conversationToken: senderId })
    .then(async ({ replies, action, memory }) => {
      if (action && action.done && memory.address) {
        const { address, distance } = await getClosestStation(memory.address.formatted)
        const unit = distance.toString().length > 3 ? 'km' : 'm'
        const converted = _.isEqual(unit, 'km') ? convert(distance).from('m').to('km').toFixed(2) : distance

        await reply(senderId, `La station la plus proche se trouve au ${address}`, conversation)
        await reply(senderId, `Elle est à environ ${converted} ${unit} d'ici`, conversation)
      } else {
        await reply(senderId, replies[0], conversation, type)
      }
    })
    .catch(err => {
      throw new Error('Client textConverse fail', err)
    })
}

export {
  handleMessage,
}
