import { DbAddAccount } from '../../../data/useCases/addaccount/DbAddAccount'
import { BcrypterAdapter } from '../../../infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { SignUpController } from '../../../presentation/controllers/Signup/SignUpController'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { makeSignupValidation } from './makeSignupValidation'

export function makeSignupController (): Controller {
  const salt = 12
  const encrypter = new BcrypterAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddcount = new DbAddAccount(encrypter, addAccountRepository)
  const validationComposite = makeSignupValidation()
  const signupController = new SignUpController(dbAddcount, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logErrorRepository)
}
