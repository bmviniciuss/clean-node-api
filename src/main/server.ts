import { MongoConnectionSingleton } from '../infra/db/mongodb/helpers'
import env from './config/env'

MongoConnectionSingleton.getInstance().connect(env.mongoUrl)
  .then(async () => {
    const app = await (await import('./config/app')).default

    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`)
    })
  })
  .catch(console.error)
