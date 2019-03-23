const config = require('config')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1024,
  },
})

schema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.get('jwtPrivateKey')
  )
}

const User = mongoose.model('User', schema)

function validate(user) {
  return Joi.validate(user, {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(10)
      .max(255),
  })
}

module.exports = {
  User,
  validate,
}
