require('module-alias/register')
const controller = require('@web_service/api/v1/quotes/controller')

const routes = (app) => {
  app.get('/api/v1/quotes', controller.getQuotes)
} 

module.exports = routes