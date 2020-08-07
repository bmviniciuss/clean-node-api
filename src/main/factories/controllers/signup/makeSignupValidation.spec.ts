
import { Validation } from '../../../../presentation/protocols/Validation'
import { EmailValidator } from '../../../../validation/protocols/EmailValidator'
import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'
import { makeSignupValidation } from './makeSignupValidation'

jest.mock('../../../../validation/validators/ValidationComposite')

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Signup Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
