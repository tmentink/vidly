const moment = require('moment')
const request = require('supertest')
const { customers, movies, rentals } = require('../../data')
const { Customer } = require('../../../models/customer')
const { Movie } = require('../../../models/movie')
const { Rental } = require('../../../models/rental')
const { User } = require('../../../models/user')

const baseUrl = '/api/returns'
const customer = customers[0]
const movie = movies[0]
const rental = rentals[0]

let server
let token
let customerId
let movieId
let rentalId

describe(baseUrl, () => {
  beforeEach(async () => {
    server = require('../../../server')
    token = new User().generateAuthToken()

    customerId = customer._id
    movieId = movie._id
    rentalId = rental._id
  })

  afterEach(async () => {
    await Customer.deleteMany({})
    await Movie.deleteMany({})
    await Rental.deleteMany({})
    await server.close()
  })

  describe('POST /', () => {
    const exec = () => {
      return request(server)
        .post(baseUrl)
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    }

    beforeEach(async () => {
      await Customer.collection.insertMany(customers)
      await Movie.collection.insertMany(movies)
      await Rental.collection.insertMany(rentals)
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if customerId is not provided', async () => {
      customerId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if movieId is not provided', async () => {
      movieId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 if no rental was found for the customer/movie', async () => {
      await Rental.deleteMany({})

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 400 if return is already processed', async () => {
      await Rental.findByIdAndUpdate(rentalId, {
        dateReturned: new Date(),
      })

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 200 if we have a valid request', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
    })

    it('should set the returnDate if input is valid', async () => {
      await exec()

      const rentalInDb = await Rental.findById(rentalId)
      const diff = new Date() - rentalInDb.dateReturned

      expect(diff).toBeLessThan(10 * 1000)
    })

    it('should set the rentalFee if input is valid', async () => {
      const daysRented = 7
      const rentalFee = rental.movie.dailyRentalRate * daysRented

      await Rental.findByIdAndUpdate(rentalId, {
        dateOut: moment()
          .add(-daysRented, 'days')
          .toDate(),
      })

      await exec()

      const rentalInDb = await Rental.findById(rentalId)
      expect(rentalInDb.rentalFee).toBe(rentalFee)
    })

    it('should increase the movie stock if input is valid', async () => {
      await exec()

      const movieInDb = await Movie.findById(movieId)
      expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    })

    it('should return the rental if input is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', rentalId.toHexString())
      expect(res.body).toHaveProperty('dateOut')
      expect(res.body).toHaveProperty('dateReturned')
      expect(res.body).toHaveProperty('rentalFee')

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
