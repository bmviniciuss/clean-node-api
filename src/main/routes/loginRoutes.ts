import { Router } from 'express'

import { adaptRoute } from '../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../factories/controllers/login/makeLoginController'
import { makeSignupController } from '../factories/controllers/signup/makeSignupController'

export default function (router: Router): void {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
