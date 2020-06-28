import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest } from '../../helpers/httpHelper'
import { HttpRequest, Controller } from '../../protocols'
import { EmailValidator } from '../Signup/SignupProtocols'
import { LoginController } from './LoginController'

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
interface MakeSutType {
  sut: Controller
  emailValidatorStub: EmailValidator
}

const makeSut = (): MakeSutType => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe('LoginController', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password',
      },
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse).toEqual(badRequest(new MissingParamError('email')))
  })
  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should calll EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should calll EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
