import { DbAuthentication } from '../../../data/useCases/authentication/DbAuthentication'
import { BcrypterAdapter } from '../../../infra/cryptography/bcrypt/BcryptAdapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { LoginController } from '../../../presentation/controllers/login/LoginController'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { makeLoginValidation } from './makeLoginValidation'

function makeAuthentication (): DbAuthentication {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bcrypterAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAuthentication(
    accountMongoRepository,
    bcrypterAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}

export function makeLoginController (): Controller {
  const dbAuthentication = makeAuthentication()
  const validation = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
