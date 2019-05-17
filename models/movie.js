const Joi = require('joi')
const mongoose = require('mongoose')
const { schema: genreSchema } = require('./genre')

const Movie = mongoose.model(
  'Movies',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
)

function validate(movie) {
  return Joi.validate(movie, {
    title: Joi.string()
      .required()
      .min(1)
      .max(255),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(255),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(255),
  })
}

module.exports = {
  Movie,
  validate,
}
