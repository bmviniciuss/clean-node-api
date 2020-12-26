import { Collection } from 'mongodb'

import { AddAccountDTO } from '../../../../domain/dto/AddAccountDTO'
import { MongoConnectionSingleton } from '../helpers/MongoConnectionSingleton'
import { AccountMongoRepository } from './AccountMongoRepository'

type MakeSutReturnType = {
  sut: AccountMongoRepository
}

function makeSut (): MakeSutReturnType {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
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
  it('Should return an account on add success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  it('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()

    const accountData:AddAccountDTO = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await accountCollection.insertOne(accountData)

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  it('Should return null if loadByEmail fails', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  it('Should update the account accessToken on updateAccessToken success', async () => {
    const { sut } = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const fakeAccount = res.ops[0]
    expect(fakeAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(fakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({ _id: fakeAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
