const request = require('supertest')
const { genres } = require('../../data')
const { Genre } = require('../../../models/genre')
const { User } = require('../../../models/user')

const baseUrl = '/api/genres'
const genre = genres[0]

let server
let token
let name

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../../server')
    token = new User({ isAdmin: true }).generateAuthToken()

    name = genre.name
  })

  afterEach(async () => {
    await Genre.deleteMany({})
    await server.close()
  })

  const exec = async () => {
    return request(server)
      .post(baseUrl)
      .set('x-auth-token', token)
      .send({ name })
  }

  it('should return 401 if no token is provided', async () => {
    token = ''

    const res = await exec()

    expect(res.status).toBe(401)
  })

  it('should return 400 if token is invalid', async () => {
    token = 'a'

    const res = await exec()

    expect(res.status).toBe(400)
  })

  it('should return 200 if token is valid', async () => {
    const res = await exec()

    expect(res.status).toBe(200)
  })
})
