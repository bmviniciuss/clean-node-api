import { AccountModel } from '../../../../domain/models/Account'
import { AddAccountDTO } from '../../../../domain/dto/AddAccountDTO'

export interface AddAccountRepository {
  add(account: AddAccountDTO): Promise<AccountModel>
}
