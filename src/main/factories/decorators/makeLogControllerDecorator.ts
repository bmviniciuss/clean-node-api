import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'

export function makeLogControllerDecorator (controller:Controller):Controller {
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}
