require('module-alias/register')
const mongoose = require('mongoose')
const config = require('@config')
const Package = require('@webService/models/package')

mongoose.Promise = global.Promise
mongoose.connect(config.database.url, {
  useMongoClient: true,
})
.then(() => Package.remove({}))
.then(() => {
  // Efficiency in tasks is not priority
  const saves = [
    new Package({ productCode: 'VS5', priceCents: 699, size: 3}).save(),
    new Package({ productCode: 'VS5', priceCents: 899, size: 5}).save(),

    new Package({ productCode: 'MB11', priceCents: 995, size: 2}).save(),
    new Package({ productCode: 'MB11', priceCents: 1695, size: 5}).save(),
    new Package({ productCode: 'MB11', priceCents: 2495, size: 8}).save(),

    new Package({ productCode: 'CF', priceCents: 595, size: 3}).save(),
    new Package({ productCode: 'CF', priceCents: 995, size: 5}).save(),
    new Package({ productCode: 'CF', priceCents: 1699, size: 9}).save(),
  ]
  return Promise.all(saves)
})
.then(() => mongoose.disconnect())
.catch((e) => {
  console.error('Error ', e)
})