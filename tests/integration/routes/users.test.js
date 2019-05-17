const request = require('supertest')
const { users } = require('../../data')
const { User } = require('../../../models/user')

const baseUrl = '/api/users'
const user = users[0]

let server
let name
let email
let password
let isAdmin

describe(baseUrl, () => {
  beforeEach(() => {
    server = require('../../../server')

    name = user.name
    email = user.email
    password = user.plainPassword
    isAdmin = user.isAdmin
  })

  afterEach(async () => {
    await User.deleteMany({})
    await server.close()
  })

  describe('POST /', () => {
    const exec = async () => {
      return request(server)
        .post(baseUrl)
        .send({ name, email, password, isAdmin })
    }

    it('should return 400 if name is missing', async () => {
      name = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is more than 255 characters', async () => {
      name = new Array(257).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if email is missing', async () => {
      email = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if email is less than 5 characters', async () => {
      email = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if email is more than 255 characters', async () => {
      email = new Array(257).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is missing', async () => {
      password = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is less than 10 characters', async () => {
      password = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is more than 255 characters', async () => {
      password = new Array(257).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should save the user if it is valid', async () => {
      await exec()

      const u = await User.find({ name })

      expect(u).not.toBeNull()
    })

    it('should return the user if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', name)
      expect(res.body).toHaveProperty('email', email)
    })

    it('should return 400 if the user is already registered', async () => {
      await exec()
      const res = await exec()

      expect(res.status).toBe(400)
    })
  })
})
