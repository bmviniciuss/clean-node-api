import { DbAddAccount } from './DbAddAccount'
import { Hasher, AccountModel, AddAccountRepository } from './DbAddAccountProtocols'
import { AddAccountDTO } from '../../../domain/dto/AddAccountDTO'

function makeHasherStub (): Hasher {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
}

function makeFakeAccountDTOData (): AddAccountDTO {
  return {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
}

function makeAddAccountReposiroty (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountDTO): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

type MakeSutReturn = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

function makeSut (): MakeSutReturn {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountReposiroty()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.execute(makeFakeAccountDTOData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeFakeAccountDTOData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.execute(makeFakeAccountDTOData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeFakeAccountDTOData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.execute(makeFakeAccountDTOData())
    expect(account).toEqual(makeFakeAccount())
  })
})
