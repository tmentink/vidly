const moment = require('moment')
const request = require('supertest')
const { Customer } = require('../../../models/customer')
const { Movie } = require('../../../models/movie')
const { Rental } = require('../../../models/rental')
const { User } = require('../../../models/user')

const baseUrl = '/api/returns'
const customers = [
  { name: 'name1', phone: '999-999-9999', isGold: true },
  { name: 'name2', phone: '111-111-1111', isGold: false },
]
const movies = [
  {
    title: 'movie1',
    genre: { name: 'name1' },
    numberInStock: 1,
    dailyRentalRate: 1,
  },
  {
    title: 'movie2',
    genre: { name: 'name2' },
    numberInStock: 1,
    dailyRentalRate: 1,
  },
]

let customerId
let movieId
let rentalId
let rental
let server
let token

const setupData = async () => {
  await Customer.collection.insertMany(customers)
  await Movie.collection.insertMany(movies)

  for (let i = 0, i_end = customers.length; i < i_end; i++) {
    const customer = await Customer.findOne({ name: customers[i].name })
    customers[i]._id = customer._id
  }

  for (let i = 0, i_end = movies.length; i < i_end; i++) {
    const movie = await Movie.findOne({ title: movies[i].title })
    movies[i]._id = movie._id
  }

  rental = new Rental({
    customer: {
      _id: customers[0]._id,
      name: customers[0].name,
      phone: customers[0].phone,
      isGold: customers[0].isGold,
    },
    movie: {
      _id: movies[0]._id,
      title: movies[0].title,
      dailyRentalRate: movies[0].dailyRentalRate,
    },
  })
  await rental.save()

  customerId = customers[0]._id.toString()
  movieId = movies[0]._id.toString()
  rentalId = rental._id.toString()
  token = new User().generateAuthToken()
}

describe(baseUrl, () => {
  beforeEach(async () => {
    server = require('../../../server')
    await setupData()
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
      await Rental.remove({})

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 400 if return is already processed', async () => {
      rental.dateReturned = new Date()
      await rental.save()

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

      rental.dateOut = moment()
        .add(-daysRented, 'days')
        .toDate()

      await rental.save()
      await exec()

      const rentalInDb = await Rental.findById(rentalId)
      expect(rentalInDb.rentalFee).toBe(rentalFee)
    })

    it('should increase the movie stock if input is valid', async () => {
      await exec()

      const movieInDb = await Movie.findById(movieId)
      expect(movieInDb.numberInStock).toBe(movies[0].numberInStock + 1)
    })

    it('should return the rental if input is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', rentalId)
      expect(res.body).toHaveProperty('dateOut')
      expect(res.body).toHaveProperty('dateReturned')
      expect(res.body).toHaveProperty('rentalFee')

      expect(res.body).toHaveProperty('customer._id', customerId)
      expect(res.body).toHaveProperty('customer.name', customers[0].name)
      expect(res.body).toHaveProperty('customer.phone', customers[0].phone)
      expect(res.body).toHaveProperty('customer.isGold', customers[0].isGold)

      expect(res.body).toHaveProperty('movie._id', movieId)
      expect(res.body).toHaveProperty('movie.title', movies[0].title)
      expect(res.body).toHaveProperty(
        'movie.dailyRentalRate',
        movies[0].dailyRentalRate
      )
    })
  })
})
