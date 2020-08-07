import { AddAccountDTO } from '../../../../domain/dto/AddAccountDTO'
import { AccountModel } from '../../../../domain/models/Account'

export interface AddAccountRepository {
  add(account: AddAccountDTO): Promise<AccountModel>
}
