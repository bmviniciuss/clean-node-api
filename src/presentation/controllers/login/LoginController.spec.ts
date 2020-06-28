import { Authentication } from '../../../domain/useCases/Authentication'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/httpHelper'
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

function makeAuthentication(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

interface MakeSutType {
  sut: Controller
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

function makeSut(): MakeSutType {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()

  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    },
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
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should calll EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidor throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  it('Should calll Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
})
