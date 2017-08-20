require('module-alias/register')
const { OrderParser, OrderFulfillmentOptions, } = require('@webService/useCases/orders')
const Package = require('@webService/models/package')

class Controller {
  async getOrderQuotes(req, res, next) {
    const orderCode = req.query.code
    try {
      const order = await OrderParser.parse(orderCode)
      const packages = await Package.find({})
      const options = await OrderFulfillmentOptions.getOptions(order, packages)
      res.json({ quote: options, })
      res.status(200)
    } catch(e) {
      res.json(e)
      res.status(400)
    }
  }
}

module.exports = new Controller()