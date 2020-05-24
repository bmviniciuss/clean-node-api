/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class SignUpController {
  handle(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      }
    }
  }
}
