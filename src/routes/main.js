import express from 'express';
import { validateWebhook, analyseMessage } from '../controllers/webhook';

// import { testCoord, testVelib } from '../controllers/location';

const router = express.Router();

router.get('/webhook', validateWebhook);
router.post('/webhook', analyseMessage);

// router.get('/coord/:origin/:destination', testCoord);
// router.get('/velib/:address', testVelib);

router.get('*', (req, res) => {
  res.send('It seems to work fine :)');
});

export default router;
