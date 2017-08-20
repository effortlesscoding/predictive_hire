
class OrderFulfillmentOptions {

  getOptions(orderCode: string) {
    this.orderCode = orderCode
    return parseOrder(orderCode)
      .then(() => getAvailableProductPackages())
      .then(() => getQuotesBasedOnPackages())
      .catch((e) => throw e)
  }

  parseOrder() {
    return OrderParser.parseOrderCode(orderCode)
      .then((parsedOrder) => this.order = parsedOrder)
      .catch((e) => throw e)
  }

  getAvailableProductPackages() {
    return Package.find({ productCode: this.order.productCode, })
      .then((availablePackages) => {
        console.log('availablePackages', availablePackages)
        this.availablePackages = availablePackages
      })
      .catch((e) => throw e)
  }

  getQuotesBasedOnPackages() {
    return PackagesQuotesFinder.getQuotes(this.order, this.availablePackages)
      .then((quotes: Array) => {

      })
      .catch((e) => throw e)
  }
}

class OrdersParser {
  async parseOrderCode(orderCode: string) {
    const parts = orderCode.split(' ')
    if (parts.length !== 2) throw new OrderException('Invalid parts length')
    if (!_.isNumber(parts[0])) throw new OrderException('Invalid order code format')
    this.order = {
      quantity: parts[0],
      productCode: parts[1],
    }
    return Promise.resolve(this.order)
  }
}

class PackagesQuotesFinder {

  async getQuotes(order: OrderRequestType, availablePackages: Array<PackageType>) {
    this.order = order
    this.packages = _.sortBy(availablePackages, 'productCount')
    this.remainingQuantity = order.quantity
    startCountingPackages()
    if (this.remainingQuantity !== 0)
      throw new OrderException('Could not find the right combination of packages for the order')
  }

  startCountingPackages() {
    let offset = 0
    while (this.remainingQuantity !== 0) {
      // Reset
      offset++
      this.remainingQuantity = this.order.quantity
      findQuantityForPackage(index, offset)
    }
  }

  validateParameters() {
    _.forEach(availablePackages, (package: PackageType) => {
      if (package.productCode !== order.productCode)
        throw new OrderException('Order and packages found do not belong to the same product type')
    })
  }

  findQuantityForPackage(index: number, offset: number) {
    const productsInPackage = this.packages[index].productCount
    if (this.remainingQuantity < productsInPackage) {
      return false
    }
    if (this.remainingQuantity % productsInPackage === 0) {
      this.packages[index].quantityOrdered = this.remainingQuantity % productsInPackage
      return true
    } else {
      this.packages[index].quantityOrdered = ~~(this.remainingQuantity / productsInPackage) - offset
      this.remainingQuantity -= this.packages[index].quantityOrdered
      const nextIndex = index + 1
      const nextOffset = 1
      if (nextIndex < this.packages.length) {
        findQuantityForPackage(nextIndex, nextOffset)
      }
    }
  }
}

/*
OPTION A:
- Build a generic parameter that you pass in the Promise Chain

OPTION B:
- Store the results in some kind of class (might work). This becomes a bit of an Object Oriented approach.
*/

/* Question #1:
1. What if someone requested 30 products?
You can go about it in at least 3 ways:
  - 10 x 3packs
  - 6 x 5packs
  - 5 x 3packs and 3x 5packs
What would be your recommendation here? Do I use some math to find the most optimal price?
I can't guarantee my algorithm will be the most optimized because it'll take me time to optimize it.

2. What if we only have 3 and 5 packs, but someone ordered 11?
*/