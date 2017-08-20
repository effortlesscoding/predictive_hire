require('module-alias/register')
const Package = require('@web_service/models/package')

class Controller {
  getQuotes(req, res, next) {
    const orderCode = req.query.code
    res.json(orderCode)
    res.status(200)
  }
}

module.exports = new Controller()