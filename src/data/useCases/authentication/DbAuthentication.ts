import { Authentication, AuthenticationModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository, private hashComparer: HashComparer) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      this.hashComparer.compare(password, account.password)
    }
    return null
  }
}
