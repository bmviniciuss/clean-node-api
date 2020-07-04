import { Authentication, AuthenticationModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { TokenGenerator } from '../../protocols/cryptography/TokenGenerator'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const validPassword = await this.hashComparer.compare(password, account.password)
      if (validPassword) {
        const token = this.tokenGenerator.generate(account.id)
      }
    }
    return null
  }
}
