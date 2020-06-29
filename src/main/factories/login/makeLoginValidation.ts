import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'
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
