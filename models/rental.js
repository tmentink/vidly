const Joi = require('joi')
const moment = require('moment')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
})

schema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  })
}

schema.methods.return = function() {
  this.dateReturned = new Date()

  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate
}

const Rental = mongoose.model('Rental', schema)

function validate(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }

  return Joi.validate(rental, schema)
}

module.exports = {
  Rental,
  validate,
}
