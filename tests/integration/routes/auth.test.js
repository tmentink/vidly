const config = require('config')
const jwt = require('jsonwebtoken')
const request = require('supertest')
const { users } = require('../../data')
const { User } = require('../../../models/user')

const baseUrl = '/api/auth'
const user = users[0]

let server
let email
let password

describe(baseUrl, () => {
  beforeEach(async () => {
    server = require('../../../server')
    await User.collection.insertOne(user)

    email = user.email
    password = user.plainPassword
  })

  afterEach(async () => {
    await User.deleteMany({})
    await server.close()
  })

  describe('POST /', () => {
    const exec = async () => {
      return request(server)
        .post(baseUrl)
        .send({ email, password })
    }

    it('should return 400 if email is missing', async () => {
      email = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
      email += 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is missing', async () => {
      password = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is invalid', async () => {
      password += 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 200 if password and email are valid', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
    })

    it('should return a token with the user payload', async () => {
      const res = await exec()
      const token = res.text
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'))

      expect(decoded).toHaveProperty('_id', user._id.toHexString())
      expect(decoded).toHaveProperty('isAdmin', user.isAdmin)
    })
  })
})
