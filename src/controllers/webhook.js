import _ from 'lodash'

import { handleMessage } from '../helpers/bot'

const analyseMessage = async (req, res) => {
  try {
    const { senderId, message } = req.body

    if (_.isUndefined(_.get(message, 'attachment.content')))
      throw new Error('[analyseMessage] Empty content.')

    await handleMessage(senderId, message)

    return res.sendStatus(200)
  } catch (error) {
    return res.status(403).send(error)
  }
}

export {
  analyseMessage,
}
