import express from 'express'
import { analyseMessage } from '../controllers/webhook'

const router = express.Router()

// Bot-connector test router
router.post('/bot', analyseMessage)

// router.get('/coord/:origin/:destination', testCoord)
// router.get('/velib/:address', testVelib)

router.get('*', (req, res) => {
  res.send('It seems to work fine :)')
})

export default router
