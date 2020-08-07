import { EmailValidatorAdapter } from '../../../../infra/validators/EmailValidatorAdapter'
import { Validation } from '../../../../presentation/protocols/Validation'
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'

export function makeLoginValidation (): Validation {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
