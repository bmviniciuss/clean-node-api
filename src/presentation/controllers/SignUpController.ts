import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'
import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
