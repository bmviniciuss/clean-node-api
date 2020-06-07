import request from 'supertest'

import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongoHelper'
import app from '../../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Vinicius Barbosa',
        email: 'vinicius_barbosa@gmail.com',
        password: '1234',
        passwordConfirmation: '1234',
      })
      .expect(200)
  })
})
