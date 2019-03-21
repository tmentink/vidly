const mongoose = require('mongoose')
const config = require('config')
const { Customer } = require('./models/customer')
const { Genre } = require('./models/genre')
const { Movie } = require('./models/movie')

const customerData = [
  {
    name: 'Marta Benson',
    phone: '(804) 426-3085',
    isGold: true,
  },
  {
    name: 'Travis Guerrero',
    phone: '(947) 418-2949',
    isGold: false,
  },
  {
    name: 'Brady Hanson',
    phone: '(969) 544-2395',
    isGold: false,
  },
  {
    name: 'Katheryn Solis',
    phone: '(974) 489-3148',
    isGold: true,
  },
  {
    name: 'Eliza Mason',
    phone: '(808) 545-2622',
    isGold: false,
  },
]
const genreData = [
  {
    name: 'Comedy',
    movies: [
      { title: 'Airplane', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'The Hangover', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'Wedding Crashers', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: 'Action',
    movies: [
      { title: 'Die Hard', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'Terminator', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'The Avengers', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: 'Romance',
    movies: [
      { title: 'The Notebook', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'When Harry Met Sally', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'Pretty Woman', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: 'Thriller',
    movies: [
      { title: 'The Sixth Sense', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'Gone Girl', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'The Others', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
]

async function seed() {
  await mongoose.connect(config.get('db'))

  await Customer.deleteMany({})
  await Movie.deleteMany({})
  await Genre.deleteMany({})

  for (const obj of customerData) {
    await new Customer({
      name: obj.name,
      phone: obj.phone,
      isGold: obj.isGold,
    }).save()
  }

  for (const genre of genreData) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save()
    const movies = genre.movies.map(movie => ({
      ...movie,
      genre: { _id: genreId, name: genre.name },
    }))
    await Movie.insertMany(movies)
  }

  mongoose.disconnect()

  console.info('Done!')
}

seed()
