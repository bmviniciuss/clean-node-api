import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default function (app: Express): void {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (!(file.includes('.test.') || file.includes('__tests__'))) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
