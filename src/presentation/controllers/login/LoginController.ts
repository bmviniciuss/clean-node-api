import { MissingParamError, InvalidParamError } from '../../errors'
import { serverError, badRequest, unauthorized, OK } from '../../helpers/httpHelper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './loginProtocols'

export class LoginController implements Controller {
  private readonly emailvalidator: EmailValidator
  private readonly authentication: Authentication

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailvalidator = emailValidator
    this.authentication = authentication
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      const validEmail = this.emailvalidator.isValid(email)
      if (!validEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return OK({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
