const mongoose = require('mongoose')
const request = require('supertest')
const { customers, movies, rentals } = require('../../data')
const { Customer } = require('../../../models/customer')
const { Movie } = require('../../../models/movie')
const { Rental } = require('../../../models/rental')
const { User } = require('../../../models/user')

const baseUrl = '/api/rentals'
const customer = customers[0]
const movie = movies[0]
const rental = rentals[0]

let server
let token
let id
let customerId
let movieId

describe(baseUrl, () => {
  beforeEach(async () => {
    server = require('../../../server')
    token = new User({ isAdmin: true }).generateAuthToken()

    id = rental._id
    customerId = rental.customer._id
    movieId = rental.movie._id
  })

  afterEach(async () => {
    await Customer.deleteMany({})
    await Movie.deleteMany({})
    await Rental.deleteMany({})
    await server.close()
  })

  describe('GET /', () => {
    it('should return all rentals', async () => {
      await Rental.collection.insertMany(rentals)

      const res = await request(server).get(baseUrl)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(rentals.length)

      rentals.forEach(rental => {
        const r = res.body.find(x => x._id === rental._id.toHexString())

        expect(r).toHaveProperty('_id')
        expect(r).toHaveProperty('dateOut')

        expect(r).toHaveProperty('customer._id', r.customer._id)
        expect(r).toHaveProperty('customer.name', r.customer.name)
        expect(r).toHaveProperty('customer.phone', r.customer.phone)
        expect(r).toHaveProperty('customer.isGold', r.customer.isGold)

        expect(r).toHaveProperty('movie._id', r.movie._id)
        expect(r).toHaveProperty('movie.title', r.movie.title)
        expect(r).toHaveProperty(
          'movie.dailyRentalRate',
          r.movie.dailyRentalRate
        )
      })
    })
  })

  describe('GET /:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get(`${baseUrl}/1`)

      expect(res.status).toBe(404)
    })

    it('should return 404 if no rental with the given id exists', async () => {
      id = mongoose.Types.ObjectId()
      const res = await request(server).get(`${baseUrl}/${id}`)

      expect(res.status).toBe(404)
    })

    it('should return a rental if valid id is passed', async () => {
      Rental.collection.insertMany(rentals)

      const res = await request(server).get(`${baseUrl}/${id}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id', id.toHexString())
      expect(res.body).toHaveProperty('dateOut')

      expect(res.body).toHaveProperty('customer._id', customerId.toHexString())
      expect(res.body).toHaveProperty('customer.name', customer.name)
      expect(res.body).toHaveProperty('customer.phone', customer.phone)
      expect(res.body).toHaveProperty('customer.isGold', customer.isGold)

      expect(res.body).toHaveProperty('movie._id', movieId.toHexString())
      expect(res.body).toHaveProperty('movie.title', movie.title)
      expect(res.body).toHaveProperty(
        'movie.dailyRentalRate',
        movie.dailyRentalRate
      )
    })
  })

  describe('POST /', () => {
    const exec = async () => {
      return request(server)
        .post(baseUrl)
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    }

    beforeEach(async () => {
      await Customer.collection.insertMany(customers)
      await Movie.collection.insertMany(movies)
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if customerId is missing', async () => {
      customerId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if customerId is invalid', async () => {
      customerId = 1

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if customer is not in database', async () => {
      customerId = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if movieId is missing', async () => {
      movieId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if movieId is invalid', async () => {
      movieId = 1

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if movie is not in database', async () => {
      movieId = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if movie is not in stock', async () => {
      await Movie.findByIdAndUpdate(movieId, {
        numberInStock: 0,
      })

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 200 if the request is valid', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
    })

    it('should decrease the movie stock by one', async () => {
      await exec()

      const movieInDb = await Movie.findById(movieId)
      expect(movieInDb.numberInStock).toBe(movie.numberInStock - 1)
    })

    it('should return the rental if input is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('dateOut')

      expect(res.body).toHaveProperty('customer._id', customerId.toHexString())
      expect(res.body).toHaveProperty('customer.name', customer.name)
      expect(res.body).toHaveProperty('customer.phone', customer.phone)
      expect(res.body).toHaveProperty('customer.isGold', customer.isGold)

      expect(res.body).toHaveProperty('movie._id', movieId.toHexString())
      expect(res.body).toHaveProperty('movie.title', movie.title)
      expect(res.body).toHaveProperty(
        'movie.dailyRentalRate',
        movie.dailyRentalRate
      )
    })
  })
})
