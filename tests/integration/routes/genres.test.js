const mongoose = require('mongoose')
const request = require('supertest')
const { genres } = require('../../data')
const { Genre } = require('../../../models/genre')
const { User } = require('../../../models/user')

const baseUrl = '/api/genres'
const genre = genres[0]

let server
let token
let id
let name

describe(baseUrl, () => {
  beforeEach(() => {
    server = require('../../../server')
    token = new User({ isAdmin: true }).generateAuthToken()

    id = genre._id
    name = genre.name
  })

  afterEach(async () => {
    await Genre.deleteMany({})
    await server.close()
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany(genres)

      const res = await request(server).get(baseUrl)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(genres.length)

      genres.forEach(genre => {
        const g = res.body.find(x => x.name === genre.name)

        expect(g).toHaveProperty('_id', genre._id.toHexString())
        expect(g).toHaveProperty('name', genre.name)
      })
    })
  })

  describe('GET /:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get(`${baseUrl}/1`)

      expect(res.status).toBe(404)
    })

    it('should return 404 if no genre with the given id exists', async () => {
      id = mongoose.Types.ObjectId()
      const res = await request(server).get(`${baseUrl}/${id}`)

      expect(res.status).toBe(404)
    })

    it('should return a genre if valid id is passed', async () => {
      await Genre.collection.insertMany(genres)

      const res = await request(server).get(`${baseUrl}/${id}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id', id.toHexString())
      expect(res.body).toHaveProperty('name', name)
    })
  })

  describe('POST /', () => {
    const exec = async () => {
      return request(server)
        .post(baseUrl)
        .set('x-auth-token', token)
        .send({ name })
    }

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if name is missing', async () => {
      name = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is less than 5 characters', async () => {
      name = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is more than 50 characters', async () => {
      name = new Array(52).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should save the genre if it is valid', async () => {
      await exec()

      const g = await Genre.find({ name })

      expect(g).not.toBeNull()
    })

    it('should return the genre if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', name)
    })
  })

  describe('PUT /:id', () => {
    const exec = async () => {
      return request(server)
        .put(`${baseUrl}/${id}`)
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(async () => {
      await Genre.collection.insertMany(genres)

      name = 'updatedName'
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if name is missing', async () => {
      name = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is less than 5 characters', async () => {
      name = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is more than 50 characters', async () => {
      name = new Array(52).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 404 if genre with the given id was not found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should update the genre if input is valid', async () => {
      await exec()

      const updatedGenre = await Genre.findById(id)

      expect(updatedGenre.name).toBe(name)
    })

    it('should return the updated genre if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', id.toHexString())
      expect(res.body).toHaveProperty('name', name)
    })
  })

  describe('DELETE /:id', () => {
    const exec = async () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send()
    }

    beforeEach(async () => {
      await Genre.collection.insertMany(genres)
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken()

      const res = await exec()

      expect(res.status).toBe(403)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 404 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should delete the genre if input is valid', async () => {
      await exec()

      const genreInDb = await Genre.findById(id)

      expect(genreInDb).toBeNull()
    })

    it('should return the removed genre', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', id.toHexString())
      expect(res.body).toHaveProperty('name', name)
    })
  })
})
