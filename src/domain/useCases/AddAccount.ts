import { AddAccountDTO } from '../dto/AddAccountDTO'
import { AccountModel } from '../models/Account'

export interface AddAccount {
  execute(account: AddAccountDTO): Promise<AccountModel>
}
