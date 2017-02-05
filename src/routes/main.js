import express from 'express'
import { validateWebhook, analyseMessage } from '../controllers/webhook'
import { receiveMessage } from '../controllers/telegram'
import { sendHelloWorld } from '../controllers/botConnector'

const router = express.Router()

// Facebook Messenger routes
router.get('/webhook', validateWebhook)
router.post('/webhook', analyseMessage)

// Telegram routes
router.post('/telegram', receiveMessage)

// Bot-connector test router
router.post('/bot', sendHelloWorld)

// router.get('/coord/:origin/:destination', testCoord)
// router.get('/velib/:address', testVelib)

router.get('*', (req, res) => {
  res.send('It seems to work fine :)')
})

export default router
