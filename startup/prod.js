const express = require('express')
const path = require('path')

module.exports = function(app, root) {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(root, '/client/build')))

    app.get('*', function(req, res) {
      res.sendFile(path.join(root, '/client/build', 'index.html'))
    })
  }
}
