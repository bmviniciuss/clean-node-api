import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/httpHelper'
import { HttpRequest, Controller } from '../../protocols'
import { LoginController } from './LoginController'

interface MakeSutType {
  sut: Controller
}

const makeSut = (): MakeSutType => {
  const sut = new LoginController()

  return {
    sut,
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
})
