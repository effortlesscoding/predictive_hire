require('module-alias/register')
const Package = require('@web_service/models/package')
const _ = require('lodash')

const QUOTE_SUCCESSFUL = 1
const QUOTE_INVALID_OFFSET = 2
const QUOTE_REMAINING_QUANTITY_EXCEEDED = 3
const QUOTE_CONTINUING_PROCESSING = 4
const QUOTE_LOOP_STARTED = 5
const QUOTE_INVALID_INDEX = 6

class OrderFulfillmentOptions {

  getOptions(order, packages) {
    this.order = order
    this.packages = packages.map((p) => {
      return { size: p.size, quantityInQuote: 0, }
    })
    this.validCombinations = []
    return new Promise((resolve, reject) => {
      this.validate()
      const res = this.startCountingLoop(this.packages, 0, this.order.size)
      if (res === QUOTE_SUCCESSFUL) {
        resolve(this.packages)
      } else {
        reject(new Error('Could not find the right combinations.'))
      }
    })
  }

  validate() {
    if (!_.isNumber(this.order.size)) throw new Error('Invalid order size')
    parseInt(this.order.size)
  }

  startCountingLoop(packages, index, remainingQuantityForTheLoop) {
    let offset = 0
    let result = QUOTE_LOOP_STARTED
    while (result !== QUOTE_SUCCESSFUL) {
      offset++
      result = this.countPackageQuantity(packages, index, offset, remainingQuantityForTheLoop)
      if (result === QUOTE_INVALID_OFFSET || 
          result === QUOTE_REMAINING_QUANTITY_EXCEEDED ||
          result === QUOTE_INVALID_INDEX) {
        break
      }
    }
    if (result !== QUOTE_SUCCESSFUL) {
      return QUOTE_CONTINUING_PROCESSING
    }
    return result
  }

  countPackageQuantity(packages, index, offset, quantityRemainingForLoop) {
    if (index > packages.length - 1) {
      return QUOTE_INVALID_INDEX
    }
    const packageSize = packages[index].size
    if (offset * packageSize > quantityRemainingForLoop) {
      return QUOTE_INVALID_OFFSET
    }
    if (quantityRemainingForLoop < packageSize) {
      return QUOTE_REMAINING_QUANTITY_EXCEEDED
    }

    if (quantityRemainingForLoop % packageSize === 0) {
      const quantityInQuote = quantityRemainingForLoop / packageSize
      this.packages[index].quantityInQuote = quantityInQuote
      quantityRemainingForLoop -= quantityInQuote * packageSize
      return QUOTE_SUCCESSFUL
    } else {
      const quantityInQuote = ~~(quantityRemainingForLoop / packageSize) - offset
      if (index < this.packages.length - 1) {
        this.packages[index].quantityInQuote = quantityInQuote 
      } else {
        this.packages[index].quantityInQuote = quantityInQuote + 1
      }
      quantityRemainingForLoop -= quantityInQuote * packageSize
      const nextIndex = index + 1
      const res = this.startCountingLoop(packages, nextIndex, quantityRemainingForLoop)
      if (res !== QUOTE_SUCCESSFUL) {
        this.packages[index].quantityInQuote = 0
      }
      return res
    }
  }

}

module.exports = new OrderFulfillmentOptions()