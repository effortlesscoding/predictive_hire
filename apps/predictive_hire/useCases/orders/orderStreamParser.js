const stream = require('stream')
const util = require('util')
const _ = require('lodash')
const OrderLineParser = require('@predictive_hire/useCases/orders/orderLineParser')
const OrderLineFulfillment = require('@predictive_hire/useCases/orders/orderLineFulfillment')
const CurrencyFormatter = require('@predictive_hire/useCases/currency/currencyFormatter')

class OrderStreamParser extends stream.Transform {
  constructor(packages) {
    super({
      readableObjectMode: true,
      writableObjectMode: false,
    })
    this.packages = packages
  }

  _formatOrderLine(accum, p) {
    if (p.quantity <= 0) return accum
    const linePrice = CurrencyFormatter.format(p.priceCents, '$')
    accum += `  ${p.quantity} x ${p.size} ${linePrice}\n`
    return accum
  }

  _formatOutput(orderLine, fulfillment) {
    const packages = _.orderBy(fulfillment.packages, ['size'], ['desc'])
    const packagesSummary = packages.reduce(this._formatOrderLine, '')
    const totalMoney = CurrencyFormatter.format(fulfillment.totalPriceCents, '$')
    const orderLineSummary = `${orderLine.size} ${orderLine.productCode} ${totalMoney}`
    return `${orderLineSummary}\n${packagesSummary}`
  }

  _transform(chunk, encoding, cb) {
    try {
      const orderLine = OrderLineParser.parse(chunk.toString())
      const fulfillment = OrderLineFulfillment.getOptions(orderLine, this.packages[orderLine.productCode])

      this.push(this._formatOutput(orderLine, fulfillment));
    } catch (e) {
      this.push(`Error -- ${e.message}\n`)
    }
    cb()
  }
}

module.exports = OrderStreamParser