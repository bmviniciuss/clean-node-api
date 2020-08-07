import { DbAuthentication } from '../../../../data/useCases/authentication/DbAuthentication'
import { BcrypterAdapter } from '../../../../infra/cryptography/bcrypt/BcryptAdapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt/JwtAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'
import env from '../../../config/env'

export function makeDBAuthentication (): DbAuthentication {
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
