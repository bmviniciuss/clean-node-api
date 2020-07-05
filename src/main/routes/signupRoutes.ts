import { Router } from 'express'

import { adaptRoute } from '../adapters/express/expressRouteAdapter'
import { makeSignupController } from '../factories/signup/makeSignupController'

export default function (router: Router): void {
  router.post('/signup', adaptRoute(makeSignupController()))
}
