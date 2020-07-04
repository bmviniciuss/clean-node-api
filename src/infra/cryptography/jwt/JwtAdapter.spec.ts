import jwt from 'jsonwebtoken'

import { JwtAdapter } from './JwtAdapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise((resolve) => resolve('any_token'))
  }
}))

type MakeSutType = {
  sut: JwtAdapter
  secret: string
}

function makeSut ():MakeSutType {
  const secret = 'secrect'
  const sut = new JwtAdapter(secret)
  return {
    sut,
    secret
  }
}

describe('', () => {
  it('Should call sign with correct values', async () => {
    const { sut, secret } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })

  it('Should return a token on sign success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  it('Should throw if sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
