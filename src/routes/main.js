import express from 'express';
import { validateWebhook, analyseMessage } from '../controllers/webhook';

const router = express.Router();

router.get('/webhook', validateWebhook);
router.post('/webhook', analyseMessage);

router.get('*', (req, res) => {
  res.send('It seems to work fine :)');
});

export default router;
