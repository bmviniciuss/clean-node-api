import { InvalidParamError } from '../../../errors'
import { CompareFieldsValidation } from '../CompareFieldsValidation'

type MakeSutType = {
  sut: CompareFieldsValidation
}

function makeSut (): MakeSutType {
  const sut = new CompareFieldsValidation('field', 'toCompareField')
  return {
    sut
  }
}

describe('CompareFieldsValidation', () => {
  it('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value', toCompareField: 'any_value' })
    expect(error).toBeUndefined()
  })

  it('should return a InvalidParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: 'any_value',
      toCompareField: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('toCompareField'))
  })
})
