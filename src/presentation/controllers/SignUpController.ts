import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'
import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }
  }
}
