const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Customer, validate } = require('../models/customer')
const valId = require('../middleware/validateObjectId')
const valReq = require('../middleware/validateRequest')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name')
  res.send(customers)
})

router.get('/:id', valId, async (req, res) => {
  const customer = await Customer.findById(req.params.id)

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found.')

  res.send(customer)
})

router.post('/', [auth, valReq(validate)], async (req, res) => {
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  })
  customer = await customer.save()

  res.send(customer)
})

router.put('/:id', [auth, valId, valReq(validate)], async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  )

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found.')

  res.send(customer)
})

router.delete('/:id', [auth, admin, valId], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found.')

  res.send(customer)
})

module.exports = router
