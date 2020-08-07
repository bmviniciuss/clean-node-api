import { AddAccountDTO } from '../../../domain/dto/AddAccountDTO'
import {
  AddAccount,
  Hasher,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './DbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async execute (accountData: AddAccountDTO): Promise<AccountModel> {
    const exists = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (exists) return null

    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
