import { Collection } from 'mongodb'
import request from 'supertest'

import { MongoConnectionSingleton } from '../../../infra/db/mongodb/helpers'
import app from '../../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoConnectionSingleton.getInstance().connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoConnectionSingleton.getInstance().getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoConnectionSingleton.getInstance().disconnect()
  })

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Vinicius Barbosa',
          email: 'vinicius_barbosa@gmail.com',
          password: '1234',
          passwordConfirmation: '1234'
        })
        .expect(200)
    })
  })

  // describe('POST /login', () => {
  //   it('Should return 200 on login', async () => {
  //     const passwordHash = await hash('1234', 12)

  //     await accountCollection.insertOne({
  //       name: 'Vinicius Barbosa',
  //       email: 'vinicius_barbosa@gmail.com',
  //       password: passwordHash
  //     })

  //     await request(app)
  //       .post('/api/login')
  //       .send({
  //         email: 'vinicius_barbosa@gmail.com',
  //         password: '1234'
  //       })
  //       .expect(200)
  //   })

  //   it('Should return 401 on login', async () => {
  //     await request(app)
  //       .post('/api/login')
  //       .send({
  //         email: 'vinicius_barbosa@gmail.com',
  //         password: '1234'
  //       })
  //       .expect(401)
  //   })
  // })
})
