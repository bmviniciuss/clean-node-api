import { AuthenticationDTO } from '../dto/AuthenticationDTO'

export interface Authentication {
  execute(authentication: AuthenticationDTO): Promise<string>
}
