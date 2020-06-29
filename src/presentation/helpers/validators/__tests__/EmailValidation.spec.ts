import { InvalidParamError, MissingParamError, ServerError } from '../../../errors'
import { EmailValidator } from '../../../protocols/EmailValidator'
import { EmailValidation } from '../EmailValidation'

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type MakeSutType = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

function makeSut(): MakeSutType {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub,
  }
}

function makeFakePayload() {
  return {
    email: 'any_email@email.com',
  }
}

describe('Email Validation', () => {
  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const payload = makeFakePayload()
    sut.validate(payload)
    expect(isValidSpy).toHaveBeenCalledWith(payload.email)
  })

  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(makeFakePayload())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
