import { AuthenticationDTO } from '../../../domain/dto/AuthenticationDTO'
import { MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized, OK } from '../../helpers/http'
import { LoginController } from './LoginController'
import { Authentication, HttpRequest, Validation } from './loginProtocols'

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

function makeAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async execute (authentication: AuthenticationDTO): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

function makeFakeRequest (): HttpRequest {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

type MakeSutType = {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

function makeSut (): MakeSutType {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()

  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('LoginController', () => {
  it('Should calll Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'execute')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  it('Should return 401 if invalid credential are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'execute').mockResolvedValueOnce(null)
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(unauthorized())
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'execute').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid credential are provided', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(OK({ accessToken: 'any_token' }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
