require('module-alias/register')
const _ = require('lodash')
const config = require('@config')
const express = require('express')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const app = express()

require('@webService/api/v1/orders')(app)

mongoose.Promise = global.Promise
mongoose.connect(config.database.url, {
  useMongoClient: true,
}).catch((e) => {
  console.error('Error ', e)
})

express.response.success = function(response, code) {
  try {
    this.status(code ? code : 200)
    this.json(response)
  } catch(e) {
    this.status(500)
    this.json('Internal error')
  }
}

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})