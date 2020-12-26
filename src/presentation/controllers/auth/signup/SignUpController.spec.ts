import { AddAccountDTO } from '../../../../domain/dto/AddAccountDTO'
import { AuthenticationDTO } from '../../../../domain/dto/AuthenticationDTO'
import { ServerError, MissingParamError, EmailInUseError } from '../../../errors'
import { OK, serverError, badRequest, forbidden } from '../../../helpers/http'
import { HttpRequest } from '../../../protocols'
import { SignUpController } from './SignUpController'
import { AddAccount, AccountModel, Validation, Authentication } from './SignupProtocols'

function makeAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async execute (account: AddAccountDTO): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

function makeFakeRequest (): HttpRequest {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

function makeAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async execute (authentication: AuthenticationDTO): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

type MakeSutType = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

function makeSut (): MakeSutType {
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'execute')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'execute').mockRejectedValueOnce(new Error())
    const httpReponse = await sut.handle(makeFakeRequest())

    expect(httpReponse).toEqual(serverError(new ServerError(null)))
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

  it('Should calll Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'execute')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'execute').mockRejectedValueOnce(new Error())
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  it('should return an accessToken on success', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(OK({ accessToken: 'any_token' }))
  })

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'execute').mockResolvedValueOnce(null)
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(forbidden(new EmailInUseError()))
  })
})
