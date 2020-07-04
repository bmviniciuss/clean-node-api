import jwt from 'jsonwebtoken'

import { JwtAdapter } from './JwtAdapter'

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
})
