const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const salt = bcrypt.genSaltSync(10)

const customers = [
  {
    _id: mongoose.Types.ObjectId(),
    name: 'name1',
    phone: '111-111-1111',
    isGold: true,
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'name2',
    phone: '222-222-2222',
    isGold: false,
  },
]

const genres = [
  { _id: mongoose.Types.ObjectId(), name: 'name1' },
  { _id: mongoose.Types.ObjectId(), name: 'name2' },
]

const movies = [
  {
    _id: mongoose.Types.ObjectId(),
    title: 'movie1',
    genre: genres[0],
    numberInStock: 1,
    dailyRentalRate: 1,
  },
  {
    _id: mongoose.Types.ObjectId(),
    title: 'movie2',
    genre: genres[1],
    numberInStock: 2,
    dailyRentalRate: 2,
  },
]

const rentals = [
  {
    _id: mongoose.Types.ObjectId(),
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
  },
  {
    customer: {
      _id: customers[1]._id,
      name: customers[1].name,
      phone: customers[1].phone,
      isGold: customers[1].isGold,
    },
    movie: {
      _id: movies[1]._id,
      title: movies[1].title,
      dailyRentalRate: movies[1].dailyRentalRate,
    },
  },
]

const users = [
  {
    _id: mongoose.Types.ObjectId(),
    name: 'name1',
    email: 'email1@test.com',
    password: bcrypt.hashSync('password11', salt),
    plainPassword: 'password11',
    isAdmin: true,
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'name2',
    email: 'email2@test.com',
    password: bcrypt.hashSync('password22', salt),
    plainPassword: 'password22',
    isAdmin: false,
  },
]

module.exports = {
  customers,
  genres,
  movies,
  rentals,
  users,
}
