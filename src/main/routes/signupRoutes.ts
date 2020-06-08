import { Router } from 'express'

import { adaptRoute } from '../adapters/expressRouteAdapter'
import { makeSignupController } from '../factories/makeSignupController'

export default function (router: Router): void {
  router.post('/signup', adaptRoute(makeSignupController()))
}
