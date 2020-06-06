import bcrypt from 'bcrypt'

import { BcrypterAdapter } from './BcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },
}))

interface MakeSutType {
  sut: BcrypterAdapter
  salt: number
}

function makeSut(salt = 12): MakeSutType {
  const sut = new BcrypterAdapter(salt)

  return {
    sut,
    salt,
  }
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')

    expect(hash).toEqual('hash')
  })
})
