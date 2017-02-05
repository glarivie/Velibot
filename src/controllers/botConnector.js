import { log, error } from 'console'
// import _ from 'lodash'

const { BC_USER, BOT_ID, AUTH_TOKEN } = process.env

const axios = require('axios').create({
  baseURL: `https://52d01999.ngrok.io/users/${BC_USER}/bots/${BOT_ID}`,
  timeout: 3000,
  headers: { Authorization: AUTH_TOKEN },
})

const sendHelloWorld = async (req, res) => {
  log('[Velibot] Ask for an Hello World')
  try {
    const { conversation } = req.body.message
    const { senderId } = req.body
    const messages = [{
      type: 'text',
      content: 'Hello World !',
    }]

    const { status } = await axios.post(`/conversations/${conversation}/messages`, {
      messages, senderId,
    })

    if (status !== 200 && status !== 201) {
      res.status(parseInt(status, 10)).send('Message sending failed')
      throw new Error('Message sending failed')
    }

    res.status(201).send('Message sent successfully')
  } catch (err) {
    error(err)
  }
}

export {
  sendHelloWorld,
}
