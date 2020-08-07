import { EmailInUseError } from '../../errors'
import { badRequest, serverError, OK, forbidden } from '../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication
} from './SignupProtocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.execute({ name, email, password })
      if (!account) return forbidden(new EmailInUseError())

      const accessToken = await this.authentication.execute({ email, password })
      return OK({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
