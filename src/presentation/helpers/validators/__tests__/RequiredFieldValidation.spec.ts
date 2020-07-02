import { MissingParamError } from '../../../errors'
import { RequiredFieldValidation } from '../RequiredFieldValidation'

type MakeSutType = {
  sut: RequiredFieldValidation
}

function makeSut (): MakeSutType {
  const sut = new RequiredFieldValidation('field')
  return {
    sut
  }
}

describe('RequiredFieldValidation', () => {
  it('should return a MissinParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
