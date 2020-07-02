import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/Validation'
import { EmailValidatorAdapter } from '../../../presentation/utils/EmailValidatorAdapter'

export function makeSignupValidation (): Validation {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
