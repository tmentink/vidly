const auth = require('../middleware/auth')
const Joi = require('joi')
const { Movie } = require('../models/movie')
const { Rental } = require('../models/rental')
const valReq = require('../middleware/validateRequest')
const express = require('express')
const router = express.Router()

router.post('/', [auth, valReq(validate)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

  if (!rental) return res.status(404).send('The rental was not found.')

  if (rental.dateReturned)
    return res.status(400).send('The return has already been processed.')

  rental.return()
  await rental.save()

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  )

  return res.send(rental)
})

function validate(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }

  return Joi.validate(req, schema)
}

module.exports = router
