const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const { Genre, validate } = require('../models/genre')
const valId = require('../middleware/validateObjectId')
const valReq = require('../middleware/validateRequest')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')
  res.send(genres)
})

router.get('/:id', valId, async (req, res) => {
  const genre = await Genre.findById(req.params.id)

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.')

  res.send(genre)
})

router.post('/', [auth, valReq(validate)], async (req, res) => {
  let genre = new Genre({ name: req.body.name })
  genre = await genre.save()

  res.send(genre)
})

router.put('/:id', [auth, valId, valReq(validate)], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  )

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.')

  res.send(genre)
})

router.delete('/:id', [auth, admin, valId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.')

  res.send(genre)
})

module.exports = router
