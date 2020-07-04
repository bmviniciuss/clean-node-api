import { Collection } from 'mongodb'

import { AddAccountModel } from '../../../../domain/useCases/AddAccount'
import { MongoHelper } from '../helpers/mongoHelper'
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
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
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

    const accountData:AddAccountModel = {
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
})
