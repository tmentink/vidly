const Joi = require('joi')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
})

const Genre = mongoose.model('Genre', schema)

function validate(genre) {
  return Joi.validate(genre, {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
  })
}

module.exports = {
  Genre,
  schema,
  validate,
}
