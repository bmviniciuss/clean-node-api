import { Express } from 'express'

import { bodyParser } from '../middlewares/bodyParser'

export default function (app: Express): void {
  app.use(bodyParser)
}
