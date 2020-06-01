import { EmailValidator } from '../protocols/EmailValidator'
import { EmailValidatorAdapter } from './EmailValidatorAdapter'

interface makeSutType {
  sut: EmailValidator
}

function makeSut(): makeSutType {
  const sut = new EmailValidatorAdapter()

  return {
    sut,
  }
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const { sut } = makeSut()

    const isValid = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })
})
