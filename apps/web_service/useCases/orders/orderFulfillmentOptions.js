require('module-alias/register')
const OrderParser = require('./orderParser')
const Package = require('@web_service/models/package')

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