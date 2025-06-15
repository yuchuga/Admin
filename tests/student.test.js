import request from 'supertest'
import app from '../app'

describe('GET /api/commonstudents', () => {
  it('Get a list of students registered to a teacher', async () => {
    const result = [
      'studentagnes@gmail.com', 
      'studentmiche@gmail.com',
      'studentalice@gmail.com'
    ]

    const response = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: 'teacherken@gmail.com' })

      expect(response.headers['content-type']).toMatch(/json/) //synchronous
      expect(response.status).toEqual(200)
      expect(response.body.students).toEqual(result)
  });

  it('Get a list of students registered to multiple teachers', async () => {
    const result = [
      'studentalice@gmail.com'
    ]

    const response = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'] })

      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.status).toEqual(200)
      expect(response.body.students).toEqual(result)
  })
});

describe('POST /api/register', () => {
  it('Register students to a teacher', async () => {
    const payload = {
      teacher: 'teacherken@gmail.com',
      students: [ 'studentalice@gmail.com' ]
    }

    const response = await request(app)
      .post('/api/register')
      .send(payload)
      .set('Content-Type', 'application/json')

      expect(response.status).toEqual(204)
  });

  it('Missing teacher in request body', async () => {
    const payload = {
      students: [
        'studentjon@gmail.com',
        'studenthon@gmail.com'
      ]
    }

    const response = await request(app)
      .post('/api/register')
      .send(payload)
      .set('Content-Type', 'application/json')

      expect(response.status).toEqual(400)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toEqual('No Teacher Found!')
  });

  it('Missing student in request body', async () => {
    const payload = {
      teacher: 'teacherken@gmail.com',
      students: []
    }

    const response = await request(app)
      .post('/api/register')
      .send(payload)
      .set('Content-Type', 'application/json')

      expect(response.status).toEqual(400)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toEqual('No Students Found!')
  })
})