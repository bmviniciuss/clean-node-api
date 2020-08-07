import { AccountModel } from '../models/Account'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  execute(account: AddAccountModel): Promise<AccountModel>
}
