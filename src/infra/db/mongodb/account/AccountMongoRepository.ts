import { AddAccountRepository } from '../../../../data/protocols/db/account/AddAccountRepository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/LoadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/UpdateAccessTokenRepository'
import { AddAccountDTO } from '../../../../domain/dto/AddAccountDTO'
import { AccountModel } from '../../../../domain/models/Account'
import { MongoConnectionSingleton, MongoMapper } from '../helpers'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountDTO): Promise<AccountModel> {
    const accountCollection = await MongoConnectionSingleton.getInstance().getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoMapper.mapCollectionId(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoConnectionSingleton.getInstance().getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (account) {
      return MongoMapper.mapCollectionId(account)
    }
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoConnectionSingleton.getInstance().getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
