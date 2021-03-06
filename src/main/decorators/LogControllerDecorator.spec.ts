import { LogErrorRepository } from '../../data/protocols/db/log/LogErrorRepository'
import { AccountModel } from '../../domain/models/Account'
import { serverError, OK } from '../../presentation/helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

function makeLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

function makeControllerStub (): Controller {
  class ControllerStub implements Controller {
    handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(OK(makeFakeAccount())))
    }
  }

  return new ControllerStub()
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

function makeFakeServerError (): HttpResponse {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

type MakeSutReturnType = {
  sut: Controller
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

function makeSut (): MakeSutReturnType {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(OK(makeFakeAccount()))
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(makeFakeServerError())

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
