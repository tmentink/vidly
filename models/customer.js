const Joi = require('joi')
const mongoose = require('mongoose')

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
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
  })
)

function validate(customer) {
  return Joi.validate(customer, {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    phone: Joi.string()
      .required()
      .min(10)
      .max(20),
    isGold: Joi.boolean(),
  })
}

module.exports = {
  Customer,
  validate,
}
