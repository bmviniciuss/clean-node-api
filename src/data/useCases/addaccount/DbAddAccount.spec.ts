import { AddAccount } from '../../../domain/useCases/AddAccount'
import { Encrypter } from '../../protocol/Encrypter'
import { DbAddAccount } from './DbAddAccount'

function makeEncrypterStub(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

interface MakeSutReturn {
  sut: AddAccount
  encrypterStub: Encrypter
}

function makeSut(): MakeSutReturn {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub,
  }
}

describe('DbAddAccount usecase', () => {
  it('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
