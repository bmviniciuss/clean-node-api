import { CompareFieldsValidation } from '../../presentation/helpers/validators/CompareFieldsValidation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/RequiredFieldValidation'
import { Validation } from '../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../presentation/helpers/validators/ValidationComposite'
import { makeSignupValidation } from './makeSignupValidation'

jest.mock('../../presentation/helpers/validators/ValidationComposite')

describe('Signup Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
