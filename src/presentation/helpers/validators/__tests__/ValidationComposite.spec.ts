import { MissingParamError } from '../../../errors'
import { Validation } from '../Validation'
import { ValidationComposite } from '../ValidationComposite'

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

type MakeSutType = {
  sut: ValidationComposite
  validationStub: Validation
}

function makeSut(): MakeSutType {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub,
  }
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
