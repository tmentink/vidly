const config = require('config')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

schema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get('jwtPrivateKey')
  )
}

const User = mongoose.model('User', schema)

function validate(user) {
  return Joi.validate(user, {
    name: Joi.string()
      .required()
      .min(1)
      .max(255),
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(10)
      .max(255),
    isAdmin: Joi.boolean(),
  })
}

module.exports = {
  User,
  validate,
}
