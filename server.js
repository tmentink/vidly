const config = require('config')
const express = require('express')
const app = express()

require('./startup/db.js')()
require('./startup/routes.js')(app)
require('./startup/validation.js')()

const port = process.env.PORT || config.get('port')
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
)

module.exports = server
