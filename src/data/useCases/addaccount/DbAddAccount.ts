import { AddAccount, Encrypter, AddAccountModel, AccountModel } from './DbAddAccountProtocols'

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
