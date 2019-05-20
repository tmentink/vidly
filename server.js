const config = require('config')
const winston = require('winston')
const express = require('express')
const app = express()

//require('./startup/logging.js')()
require('./startup/config.js')()
require('./startup/db.js')()
require('./startup/routes.js')(app)
require('./startup/validation.js')()
require('./startup/prod.js')(app, __dirname)

const port = process.env.PORT || config.get('port')
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
)

module.exports = server
