import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { log, error } from 'console';

const { BC_USER, BOT_ID, SERVER_PORT, AUTH_TOKEN } = process.env;

const api = axios.create({
  baseURL: `https://52d01999.ngrok.io/users/${BC_USER}/bots/${BOT_ID}`,
  timeout: 3000,
  headers: { Authorization: AUTH_TOKEN },
});

const app = express();
app.set('port', SERVER_PORT || 5000);
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.send('Api is working fine !');
});

app.post('/bot', async (req, res) => {
  log('[Test] Ask for an Hello World');
  try {
    const { conversation } = req.body.message;
    const { senderId } = req.body;
    const messages = [{
      type: 'text',
      content: 'Hello World !',
    }];
    const { status } = await api.post(`/conversations/${conversation}/messages`, {
      messages, senderId,
    });

    if (status !== 200 && status !== 201) {
      res.status(parseInt(status, 10)).send('Message sending failed');
      throw new Error('Message sending failed');
    }

    res.status(201).send('Message sent successfully');
  } catch (err) {
    error(err);
  }
});

app.listen(app.get('port'), () => {
  log('Bot is running on port', app.get('port'));
});
