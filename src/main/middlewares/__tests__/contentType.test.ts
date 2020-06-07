import request from 'supertest'

import app from '../../config/app'

describe('Content Type middleware', () => {
  it('Should return default content type as json', async () => {
    // Create a Test Route to test middleware integration
    app.get('/test_content_type', (req, res) => {
      res.send()
    })

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  it('Should return xml content type when forced', async () => {
    // Create a Test Route to test middleware integration
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app).get('/test_content_type_xml').expect('content-type', /xml/)
  })
})
