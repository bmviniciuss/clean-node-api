import { AddAccountDTO } from '../../../domain/dto/AddAccountDTO'
import {
  AddAccount,
  Hasher,
  AccountModel,
  AddAccountRepository
} from './DbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async execute (accountData: AddAccountDTO): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
