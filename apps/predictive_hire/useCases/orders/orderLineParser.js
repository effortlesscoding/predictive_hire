const OrderException = require('./errors').OrderException
const _ = require('lodash')

class OrderLineParser {
  parse(orderLineCode) {
    const parts = orderLineCode.replace('\n', '').split(' ')
    if (parts.length !== 2) throw new OrderException('Invalid parts length')
    const orderSize = this.orderSize(parts)
    if (_.isNil(orderSize)) throw new OrderException('Invalid order line size')
    return {
      size: orderSize,
      productCode: parts[1],
    }
  }

  orderSize(parts) {
    try {
      const value = parseFloat(parts[0])
      return _.isInteger(value) ? parseInt(value) : undefined
    } catch(e) {
      return undefined
    }
  }
}

module.exports = new OrderLineParser()