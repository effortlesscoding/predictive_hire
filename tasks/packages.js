require('module-alias/register')
const mongoose = require('mongoose')
const config = require('@config')
const Package = require('@webService/models/package')
const CODE = 'PORK_BUN'

mongoose.Promise = global.Promise
mongoose.connect(config.database.url, {
  useMongoClient: true,
})
.then(() => Package.remove({}))
.then(() => {
  // Efficiency in tasks is not priority
  const saves = [
    new Package({ productCode: CODE, priceCents: 100, size: 3}).save(),
    new Package({ productCode: CODE, priceCents: 150, size: 5}).save(),
    new Package({ productCode: CODE, priceCents: 300, size: 11}).save(),
  ]
  return Promise.all(saves)
})
.then(() => mongoose.disconnect())
.catch((e) => {
  console.error('Error ', e)
})