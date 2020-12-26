import { SignUpController } from '../../../../presentation/controllers/auth/signup/SignUpController'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/makeLogControllerDecorator'
import { makeDBAddAccount } from '../../useCases/addAccount/makeDBAddAccount'
import { makeDBAuthentication } from '../../useCases/authentication/makeDBAuthentication'
import { makeSignupValidation } from './makeSignupValidation'

export function makeSignupController (): Controller {
  const signupController = new SignUpController(makeDBAddAccount(), makeSignupValidation(), makeDBAuthentication())
  return makeLogControllerDecorator(signupController)
}
