const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../models/user')
const valReq = require('../middleware/validateRequest')
const express = require('express')
const router = express.Router()

router.post('/', valReq(validate), async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password.')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password.')

  const token = user.generateAuthToken()
  res.send(token)
})

function validate(req) {
  return Joi.validate(req, {
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

module.exports = router
