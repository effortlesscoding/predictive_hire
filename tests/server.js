const _ = require('lodash')

const QUOTE_SUCCESSFUL = 1
const QUOTE_INVALID_OFFSET = 2
const QUOTE_REMAINING_QUANTITY_EXCEEDED = 3
const QUOTE_CONTINUING_PROCESSING = 4
const QUOTE_LOOP_STARTED = 5
const QUOTE_INVALID_INDEX = 6

class PackagesQuotesFinder {

  getQuotes(order, availablePackages) {
    this.order = order
    this.packages = _.sortBy(availablePackages, 'productCount')
    this.remainingQuantity = order.quantity
    const result = this.startCountingLoop(0, this.order.quantity)
    if (result !== QUOTE_SUCCESSFUL)
      throw new Error('Could not find the right combination of packages for the order')
    return this.packages
  }

  validateParameters() {
    _.forEach(this.packages, (p) => {
      if (p.productCode !== this.order.productCode)
        throw new Error('Order and packages found do not belong to the same product type')
    })
  }

  startCountingLoop(index, remainingQuantityForTheLoop) {
    let offset = 0
    let result = QUOTE_LOOP_STARTED
    while (result !== QUOTE_SUCCESSFUL) {
      offset++
      const quantityRemainingForLoop = remainingQuantityForTheLoop
      result = this.countQuantityToOrder(index, offset, quantityRemainingForLoop)
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

  countQuantityToOrder(index, offset, quantityRemainingForLoop) {
    if (index > this.packages.length - 1) {
      return QUOTE_INVALID_INDEX
    }
    const productsInPackage = this.packages[index].productCount
    if (offset * productsInPackage > quantityRemainingForLoop) {
      return QUOTE_INVALID_OFFSET
    }
    if (quantityRemainingForLoop < productsInPackage) {
      return QUOTE_REMAINING_QUANTITY_EXCEEDED
    }
    if (quantityRemainingForLoop % productsInPackage === 0) {
      const quantityOrdered = quantityRemainingForLoop / productsInPackage
      this.packages[index].quantityOrdered = quantityOrdered
      quantityRemainingForLoop -= quantityOrdered * productsInPackage
      return QUOTE_SUCCESSFUL
    } else {
      const quantityOrdered = ~~(quantityRemainingForLoop / productsInPackage) - offset
      if (index < this.packages.length - 1) {
        this.packages[index].quantityOrdered = quantityOrdered 
      } else {
        this.packages[index].quantityOrdered = quantityOrdered + 1
      }
      quantityRemainingForLoop -= quantityOrdered * productsInPackage
      const nextIndex = index + 1
      const res = this.startCountingLoop(nextIndex, quantityRemainingForLoop)
      if (res !== QUOTE_SUCCESSFUL) {
        this.packages[index].quantityOrdered = 0
      }
      return res
    }
  }
}


const quotesFinder = new PackagesQuotesFinder()

/// Test 1:
const packages = [
  { productCode: 'PORK_BUN', productCount: 7, quantityOrdered: 0 },
  { productCode: 'PORK_BUN', productCount: 20, quantityOrdered: 0 },
  { productCode: 'PORK_BUN', productCount: 71, quantityOrdered: 0 }
]

const order = {
  productCode: 'PORK_BUN',
  quantity: 78,
}

const result = quotesFinder.getQuotes(order, packages)
console.log('Result -- ', result)