import { DbAddAccount } from './DbAddAccount'
import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './DbAddAccountProtocols'

function makeEncrypterStub (): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
}

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
}

function makeAddAccountReposiroty (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

type MakeSutReturn = {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

function makeSut (): MakeSutReturn {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountReposiroty()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount usecase', () => {
  it('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccountData())

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
