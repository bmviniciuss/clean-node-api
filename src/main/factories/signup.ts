import { DbAddAccount } from '../../data/useCases/addaccount/DbAddAccount'
import { BcrypterAdapter } from '../../infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/Account'
import { SignUpController } from '../../presentation/controllers/Signup/SignUpController'
import { EmailValidatorAdapter } from '../../presentation/utils/EmailValidatorAdapter'

export function makeSignupController(): SignUpController {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BcrypterAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddcount = new DbAddAccount(encrypter, addAccountRepository)
  return new SignUpController(emailValidator, dbAddcount)
}
