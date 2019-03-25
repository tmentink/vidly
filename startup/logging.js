const config = require('config')
const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: config.get('Logs.exceptions') })
  )

  process.on('unhandledRejection', ex => {
    throw ex
  })

  winston.add(winston.transports.File, {
    filename: config.get('Logs.combined'),
  })

  winston.add(winston.transports.MongoDB, {
    db: config.get('db'),
    level: 'info',
  })
}
