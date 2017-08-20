require('module-alias/register')
const controller = require('@webService/api/v1/orders/controller')

const routes = (app) => {
  app.get('/api/v1/orders/options', controller.getOrderQuotes)
} 

module.exports = routes