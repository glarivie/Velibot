import 'babel-polyfill'
import 'dotenv/config'
import './config/express'

process.on('uncaughtException', error => {
  throw new Error(error, 'Uncaught exception')
})
