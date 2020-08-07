import { DBAddAccount } from '../../../../data/useCases/addaccount/DBAddAccount'
import { AddAccount } from '../../../../domain/useCases/AddAccount'
import { BcrypterAdapter } from '../../../../infra/cryptography/bcrypt/BcryptAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'

export function makeDBAddAccount ():AddAccount {
  const salt = 12
  const encrypter = new BcrypterAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  return new DBAddAccount(encrypter, addAccountRepository, addAccountRepository)
}
