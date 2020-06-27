import { MissingParamError } from '../../errors'
import { serverError, badRequest } from '../../helpers/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
