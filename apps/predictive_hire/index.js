require('module-alias/register')
const OrderStreamParser = require('@predictive_hire/useCases/orders/orderStreamParser')
const packages = require('@samples/packages')
const orderParser = new OrderStreamParser(packages)

process.stdin
       .pipe(orderParser)
       .pipe(process.stdout)