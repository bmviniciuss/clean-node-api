import { AccountModel } from '../../../domain/models/Account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/AddAccount'
import { Encrypter } from '../../protocol/Encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const { password } = account

    await this.encrypter.encrypt(password)

    return new Promise((resolve) => resolve(null))
  }
}
