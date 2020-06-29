import { InvalidParamError } from '../../errors'
import { badRequest, serverError, OK } from '../../helpers/httpHelper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount, Validation } from './SignupProtocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccount.add({ name, email, password })
      return OK(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
