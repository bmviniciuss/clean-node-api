import { EmailValidatorAdapter } from '../../../../infra/validators/EmailValidatorAdapter'
import { Validation } from '../../../../presentation/protocols/Validation'
import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite
} from '../../../../validation/validators'

export function makeSignupValidation (): Validation {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
