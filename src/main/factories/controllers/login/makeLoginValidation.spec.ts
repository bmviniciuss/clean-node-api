
import { Validation } from '../../../../presentation/protocols/Validation'
import { EmailValidator } from '../../../../validation/protocols/EmailValidator'
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'
import { makeLoginValidation } from './makeLoginValidation'

jest.mock('../../../../validation/validators/ValidationComposite')

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
