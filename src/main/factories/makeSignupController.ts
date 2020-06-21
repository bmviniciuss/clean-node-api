import { DbAddAccount } from '../../data/useCases/addaccount/DbAddAccount'
import { BcrypterAdapter } from '../../infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../infra/db/mongodb/log/LogMongoRepository'
import { SignUpController } from '../../presentation/controllers/Signup/SignUpController'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../presentation/utils/EmailValidatorAdapter'
import { LogControllerDecorator } from '../decorators/LogControllerDecorator'

export function makeSignupController(): Controller {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BcrypterAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddcount = new DbAddAccount(encrypter, addAccountRepository)
  const signupController = new SignUpController(emailValidator, dbAddcount)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logErrorRepository)
}
