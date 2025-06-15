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

      //synchronous
      expect(response.headers['content-type']).toMatch(/json/)
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
  });
});
