import { MissingParamError, InvalidParamError } from '../../errors'
import { serverError, badRequest } from '../../helpers/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../Signup/SignupProtocols'

export class LoginController implements Controller {
  private readonly emailvalidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailvalidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const validEmail = this.emailvalidator.isValid(httpRequest.body.email)
      if (!validEmail) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
