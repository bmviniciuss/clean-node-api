import { Authentication, AuthenticationModel } from '../../../domain/useCases/Authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return null
  }
}
