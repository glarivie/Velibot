import { log, error } from 'console'
import _ from 'lodash'

const { BC_USER, BOT_ID, AUTH_TOKEN, GROMIT_URL } = process.env

const axios = require('axios').create({
  baseURL: `${GROMIT_URL}/users/${BC_USER}/bots/${BOT_ID}`,
  headers: { Authorization: AUTH_TOKEN },
})

const send = async (payload, conversation) => {
  try {
    const url = `/conversations/${conversation}/messages`
    const { status } = await axios.post(url, payload)

    if (!_.includes([200, 201], _.toNumber(status))) {
      throw new Error(status, 'Message sending failed')
    }

    log('Message sent successfully')
  } catch (err) {
    error(err)
  }
}

const reply = async (senderId, content, conversation, type = 'text') =>
  await send({ messages: [{ type, content }], senderId }, conversation)

export {
  reply,
  send,
}
