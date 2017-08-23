require('module-alias/register')
const { OrderParser, OrderFulfillmentOptions, } = require('@webService/useCases/orders')
const Package = require('@webService/models/package')
const PackageSerializer = require('@webService/serializers/package')

class Controller {

  async getOrderQuotes(req, res, next) {
    const orderCode = req.query.code
    const single = req.query.single
    try {
      const order = await new OrderParser().parse(orderCode)
      const packages = await Package.find({ productCode: order.productCode, }, '', {lean: true})
      let options = await new OrderFulfillmentOptions().getOptions(order, packages)
      if (single) {
        const option = options[0].map(PackageSerializer)
        res.success({ option, })
      } else {
        options = options.map((o) => o.map(PackageSerializer))
        res.success({ options, })
      }
    } catch(e) {
      res.json(e)
      res.status(400)
    }
  }
}

module.exports = new Controller()