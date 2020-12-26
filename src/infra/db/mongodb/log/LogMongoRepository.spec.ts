import { Collection } from 'mongodb'

import { MongoConnectionSingleton } from '../helpers'
import { LogMongoRepository } from './LogMongoRepository'

type MakeSutType = {
  sut: LogMongoRepository
}

function makeSut (): MakeSutType {
  const sut = new LogMongoRepository()
  return {
    sut
  }
}

describe('LogMongoReposiory', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoConnectionSingleton.getInstance().connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    errorCollection = await MongoConnectionSingleton.getInstance().getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoConnectionSingleton.getInstance().disconnect()
  })

  it('Should create an error log on success ', async () => {
    const { sut } = makeSut()
    await sut.logError('any_error')

    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
