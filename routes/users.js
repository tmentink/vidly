const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
const valReq = require('../middleware/validateRequest')
const express = require('express')
const router = express.Router()

router.post('/', valReq(validate), async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered.')

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  })

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
})

module.exports = router
