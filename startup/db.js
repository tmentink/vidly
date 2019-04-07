const config = require('config')
const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function() {
  const db = config.get('db')
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => winston.info(`Connected to ${db}...`))
}
