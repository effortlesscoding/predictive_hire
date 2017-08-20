const OrderException = require('./errors').OrderException
const _ = require('lodash')

class OrderParser {
  async parse(orderCode) {
    const parts = orderCode.split(' ')
    if (parts.length !== 2) throw new OrderException('Invalid parts length')
    const orderSize = this.orderSize(parts)
    if (_.isNil(orderSize)) throw new OrderException('Invalid order size')
    return {
      size: orderSize,
      productCode: parts[1],
    }
  }

  orderSize(parts) {
    try {
      return parseInt(parts[0])
    } catch(e) {
      return undefined
    }
  }
}

module.exports = new OrderParser()