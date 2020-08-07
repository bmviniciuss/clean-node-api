import { LoginController } from '../../../../presentation/controllers/login/LoginController'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/makeLogControllerDecorator'
import { makeDBAuthentication } from '../../useCases/authentication/makeDBAuthentication'
import { makeLoginValidation } from './makeLoginValidation'

export function makeLoginController (): Controller {
  const loginController = new LoginController(makeDBAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
