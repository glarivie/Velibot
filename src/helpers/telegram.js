import _ from 'lodash'
import { log } from 'console'

const { BC_USER, BOT_ID, AUTH_TOKEN } = process.env

const axios = require('axios').create({
  baseURL: `https://52d01999.ngrok.io/users/${BC_USER}/bots/${BOT_ID}`,
  timeout: 3000,
  headers: { Authorization: AUTH_TOKEN },
})

const sendMessage = async (id, text) => {
  const { status } = await axios.post('/sendMessage', {
    chat_id: id,
    text,
  })

  if (!_.isEqual(status, 200))
    throw new Error(`[Telegram][Status ${status}] Cannot send message`)

  return log('[Telegram] Message sent successfully !')
}

const analyseMessage = async (id, content, /* type = 'text' */) => {
  if (_.isUndefined(id))
    throw new Error('[Telegram][Error] Chat iD is missing')

  if (_.isUndefined(content))
    throw new Error('[Telegram][Error] Message has no content')

  // Just send Hello World
  await sendMessage(id, 'Hello World')
}

export {
  analyseMessage,
  sendMessage,
}
