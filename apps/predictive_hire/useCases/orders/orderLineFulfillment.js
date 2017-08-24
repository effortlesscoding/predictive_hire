require('module-alias/register')
const _ = require('lodash')
const OrderException = require('./errors').OrderException

const ABORT_LOOP = -1
const CONTINUE_LOOP = 0

class OrderFulfillmentOptions {

  getOptions(order, packages) {
    this.order = order
    this.originalPackages = packages
    this.smallestCombination = null
    this.validate()
    this.countLoop(this.resetPackages(), 0, 0, this.order.size)
    if (this.smallestCombination) {
      return this.smallestCombination
    } else {
      throw new OrderException('Could not find the right combinations.')
    }
  }

  validate() {
    if (_.isNil(this.originalPackages)) throw new OrderException('Invalid order packages') 
    if (!(this.originalPackages.length > 0)) throw new OrderException('Invalid order packages') 
    if (!_.isFinite(this.order.size)) throw new OrderException('Invalid order size')
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
        const res = this.addCombination(packages)
        packages = this.resetPackages()
        if (res === ABORT_LOOP) return res
      } else if (index < packages.length - 1) {
        const res = this.countLoop(packages, index + 1, 0, remainder)
        if (res === ABORT_LOOP) return res
      }
      packageQuantity++
    }
  }

  addCombination(packages) {
    const aggregation = packages.reduce((accum, next) => {
      accum.totalPackages += next.quantity
      accum.totalPriceCents += next.priceCents * next.quantity
      return accum
    }, { totalPackages: 0, totalPriceCents: 0, })

    if (aggregation.totalPackages > 0 &&
        (!this.smallestCombination || aggregation.totalPackages < this.smallestCombination.size)) {
      this.smallestCombination = {
        packages: packages.map((p) => ({ ...p, })),
        quantity: aggregation.totalPackages,
        totalPriceCents: aggregation.totalPriceCents,
      }
    }
    if (aggregation.totalPackages === 1) {
      return ABORT_LOOP
    } else {
      return CONTINUE_LOOP
    }
  }

  resetPackages() {
    return this.originalPackages.map((p) => ({ ...p, quantity: 0,}))
  }
}

module.exports = new OrderFulfillmentOptions()