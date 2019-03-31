const request = require('supertest')
const { Genre } = require('../../../models/genre')
const { Movie } = require('../../../models/movie')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')

const baseUrl = '/api/movies'
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
let server
let token
let title
let genreId
let numberInStock
let dailyRentalRate

const setupData = async () => {
  const genres = movies.map(m => {
    return { name: m.genre.name }
  })
  await Genre.collection.insertMany(genres)

  for (let i = 0, i_end = movies.length; i < i_end; i++) {
    const genre = await Genre.findOne({ name: genres[i].name })
    movies[i].genre._id = genre._id.toString()
  }

  token = new User({ isAdmin: true }).generateAuthToken()
  title = movies[0].title
  genreId = movies[0].genre._id
  numberInStock = movies[0].numberInStock
  dailyRentalRate = movies[0].dailyRentalRate
}

describe(baseUrl, () => {
  beforeEach(async () => {
    server = require('../../../server')
    await setupData()
  })

  afterEach(async () => {
    await Genre.deleteMany({})
    await Movie.deleteMany({})
    await server.close()
  })

  describe('GET /', () => {
    it('should return all movies', async () => {
      await Movie.collection.insertMany(movies)

      const res = await request(server).get(baseUrl)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(movies.length)

      movies.forEach(movie => {
        const m = res.body.find(x => x.title === movie.title)

        expect(m).toHaveProperty('title', movie.title)
        expect(m).toHaveProperty('genre')
        expect(m).toHaveProperty('numberInStock', movie.numberInStock)
        expect(m).toHaveProperty('dailyRentalRate', movie.dailyRentalRate)
      })
    })
  })

  describe('GET /:id', () => {
    it('should return a movie if valid id is passed', async () => {
      const movie = new Movie(movies[0])
      await movie.save()

      const res = await request(server).get(`${baseUrl}/${movie._id}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('title', movie.title)
      expect(res.body).toHaveProperty('genre')
      expect(res.body).toHaveProperty('numberInStock', movie.numberInStock)
      expect(res.body).toHaveProperty('dailyRentalRate', movie.dailyRentalRate)
    })

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get(`${baseUrl}/1`)

      expect(res.status).toBe(404)
    })

    it('should return 404 if no movie with the given id exists', async () => {
      const id = mongoose.Types.ObjectId()
      const res = await request(server).get(`${baseUrl}/${id}`)

      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    const exec = async () => {
      return request(server)
        .post(baseUrl)
        .set('x-auth-token', token)
        .send({ title, genreId, numberInStock, dailyRentalRate })
    }

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if title is missing', async () => {
      title = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if title is less than 5 characters', async () => {
      title = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if title is more than 255 characters', async () => {
      title = new Array(257).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if genreId is missing', async () => {
      genreId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if genreId is invalid', async () => {
      genreId = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if numberInStock is missing', async () => {
      numberInStock = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if numberInStock is less than 0', async () => {
      numberInStock = -1

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if numberInStock is greater than 255', async () => {
      numberInStock = 256

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if dailyRentalRate is missing', async () => {
      dailyRentalRate = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if dailyRentalRate is less than 0', async () => {
      dailyRentalRate = -1

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if dailyRentalRate is greater than 255', async () => {
      dailyRentalRate = 256

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should save the movie if it is valid', async () => {
      await exec()

      const movie = await Movie.find({ title: movies[0].title })

      expect(movie).not.toBeNull()
    })

    it('should return the movie if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('title', movies[0].title)
      expect(res.body).toHaveProperty('genre', movies[0].genre)
      expect(res.body).toHaveProperty('numberInStock', movies[0].numberInStock)
      expect(res.body).toHaveProperty(
        'dailyRentalRate',
        movies[0].dailyRentalRate
      )
    })
  })

  describe('PUT /:id', () => {
    let movie
    let id

    const exec = async () => {
      return request(server)
        .put(`${baseUrl}/${id}`)
        .set('x-auth-token', token)
        .send({ title, genreId, numberInStock, dailyRentalRate })
    }

    beforeEach(async () => {
      movie = new Movie(movies[0])
      await movie.save()

      id = movie._id
      title = 'updatedTitle'
      genreId = movies[1].genre._id
      numberInStock = 2
      dailyRentalRate = 2
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if title is missing', async () => {
      title = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if title is less than 5 characters', async () => {
      title = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if title is more than 255 characters', async () => {
      title = new Array(257).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if genreId is missing', async () => {
      genreId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if genreId is invalid', async () => {
      genreId = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if numberInStock is missing', async () => {
      numberInStock = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if numberInStock is less than 0', async () => {
      numberInStock = -1

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if numberInStock is greater than 255', async () => {
      numberInStock = 256

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if dailyRentalRate is missing', async () => {
      dailyRentalRate = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if dailyRentalRate is less than 0', async () => {
      dailyRentalRate = -1

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if dailyRentalRate is greater than 255', async () => {
      dailyRentalRate = 256

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 404 if movie with the given id was not found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should update the movie if input is valid', async () => {
      await exec()

      const updatedMovie = await Movie.findById(movie._id)

      expect(updatedMovie.title).toBe(title)
    })

    it('should return the updated movie if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('title', title)
      expect(res.body).toHaveProperty('genre')
      expect(res.body).toHaveProperty('numberInStock', numberInStock)
      expect(res.body).toHaveProperty('dailyRentalRate', dailyRentalRate)
    })
  })

  describe('DELETE /:id', () => {
    let movie
    let id

    const exec = async () => {
      return request(server)
        .delete(`/api/movies/${id}`)
        .set('x-auth-token', token)
        .send()
    }

    beforeEach(async () => {
      movie = new Movie(movies[0])
      await movie.save()

      id = movie._id
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

    it('should return 404 if no movie with the given id was found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should delete the movie if input is valid', async () => {
      await exec()

      const movieInDb = await Movie.findById(id)

      expect(movieInDb).toBeNull()
    })

    it('should return the removed movie', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', movie._id.toHexString())
      expect(res.body).toHaveProperty('title', movie.title)
      expect(res.body).toHaveProperty('genre')
      expect(res.body).toHaveProperty('numberInStock', movie.numberInStock)
      expect(res.body).toHaveProperty('dailyRentalRate', movie.dailyRentalRate)
    })
  })
})
