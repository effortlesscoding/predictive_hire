require('module-alias/register')
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

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})