import { badRequest, serverError, OK } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './SignupProtocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      return OK(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
