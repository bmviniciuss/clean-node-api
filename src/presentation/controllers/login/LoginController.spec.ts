import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, unauthorized, OK } from '../../helpers/httpHelper'
import { LoginController } from './LoginController'
import { Authentication, EmailValidator, HttpRequest } from './loginProtocols'

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
  sut: LoginController
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

  it('Should return 401 if invalid credential are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(unauthorized())
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      }),
    )
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid credential are provided', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(OK({ accessToken: 'any_token' }))
  })
})
