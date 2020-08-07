import { DBAuthentication } from '../../../../data/useCases/authentication/DBAuthentication'
import { BcrypterAdapter } from '../../../../infra/cryptography/bcrypt/BcryptAdapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt/JwtAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'
import env from '../../../config/env'

export function makeDBAuthentication (): DBAuthentication {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bcrypterAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  return new DBAuthentication(
    accountMongoRepository,
    bcrypterAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
