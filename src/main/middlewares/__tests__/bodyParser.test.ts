import request from 'supertest'

import app from '../../config/app'

describe('Body Parser middleware', () => {
  it('Should parse body as json', async () => {
    // Create a Test Route to test middleware integration
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({
        name: 'Vinicius Barbosa'
      })
      .expect({
        name: 'Vinicius Barbosa'
      })
  })
})
