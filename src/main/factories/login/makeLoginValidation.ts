import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { Validation } from '../../../presentation/protocols/Validation'
import { EmailValidatorAdapter } from '../../../presentation/utils/EmailValidatorAdapter'

export function makeLoginValidation(): Validation {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
