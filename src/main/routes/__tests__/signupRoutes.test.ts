import request from 'supertest'

import app from '../../config/app'

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Vinicius Barbosa',
        email: 'vinicius_barbosa@gmail.com',
        password: '1234',
        passwordConfirmation: '1234',
      })
      .expect(200)
  })
})
