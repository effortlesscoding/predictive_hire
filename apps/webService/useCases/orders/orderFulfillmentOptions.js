require('module-alias/register')
const Package = require('@webService/models/package')
const _ = require('lodash')
const OrderException = require('./errors').OrderException

const QUOTE_SUCCESSFUL = 1
const QUOTE_INVALID_OFFSET = 2
const QUOTE_REMAINING_QUANTITY_EXCEEDED = 3
const QUOTE_CONTINUING_PROCESSING = 4
const QUOTE_LOOP_STARTED = 5
const QUOTE_INVALID_INDEX = 6

class OrderFulfillmentOptions {

  async getOptions(order, packages) {
    this.order = order
    this.originalPackages = packages
    this.validCombinations = []
    this.validate()
    this.countLoop(this.resetPackages(), 0, 0, this.order.size)
    if (this.validCombinations.length > 0) {
      return this.validCombinations
    } else {
      throw new OrderException('Could not find the right combinations.')
    }
  }

  validate() {
    if (_.isNil(this.originalPackages)) throw new OrderException('Invalid order packages') 
    if (!(this.originalPackages.length > 0)) throw new OrderException('Invalid order packages') 
    if (!_.isNumber(this.order.size)) throw new OrderException('Invalid order size')
    parseInt(this.order.size)
  }

  countLoop(packages, index, offset, remainingQuantity) {
    if (index >= packages.length) return QUOTE_INVALID_INDEX
    const packageSize = packages[index].size
    const maxOffset = ~~(remainingQuantity / packageSize)
    let packageQuantity = 0
    while (packageQuantity <= maxOffset) {
      const sampleSize = packageSize * packageQuantity
      const remainder = remainingQuantity - sampleSize
      packages[index].quantity = packageQuantity
      if (remainder === 0) {
        this.addCombination(packages)
        packages = this.resetPackages()
      } else if (index < packages.length - 1) {
        this.countLoop(packages, index + 1, 0, remainder)
      }
      packageQuantity++
    }
  }

  addCombination(packages) {
    this.validCombinations.push(packages.map((p) => ({ ...p, })))
  }

  resetPackages() {
    return this.originalPackages.map((p) => ({ ...p, quantity: 0,}))
  }
}

module.exports = new OrderFulfillmentOptions()