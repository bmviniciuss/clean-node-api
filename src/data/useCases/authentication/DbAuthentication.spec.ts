import { AccountModel } from '../../../domain/models/Account'
import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository'
import { DbAuthentication } from './DbAuthentication'

function makeLoadAccountByEmailRepository ():LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    load (email: string): Promise<AccountModel> {
      const account:AccountModel = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
      return new Promise((resolve) => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type MakeSutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

function makeSut (): MakeSutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

function makeAccount () {
  return {
    email: 'any_mail@email.com',
    password: 'any_password'
  }
}

describe('DbAuthentication', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const account = makeAccount()
    await sut.auth(account)
    expect(loadSpy).toHaveBeenCalledWith(account.email)
  })
})
