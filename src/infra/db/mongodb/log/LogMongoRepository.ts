import { LogErrorRepository } from '../../../../data/protocols/db/log/LogErrorRepository'
import { MongoConnectionSingleton } from '../helpers'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoConnectionSingleton.getInstance().getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
