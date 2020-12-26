export type HttpRequest = {
  body?: any
}

export type HttpResponse<T = any> = {
  statusCode: number
  body: T
}
