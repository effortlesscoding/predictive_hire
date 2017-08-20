const OrderFulfillmentOptions = require('./orderFulfillmentOptions')
const Package = require('../../models/package')

describe('orderFulfillmentOptions', function() {

  const availablePackages = []

  before((done) => {
    availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 3, priceCents: 115}))
    availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 7, priceCents: 225}))
    availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 71, priceCents: 2000}))
    done()
  })

  it('should give 10x3sized package as an option if order of size 30 is supplied', (done) => {
    OrderFulfillmentOptions.getOptions(
      { productCode: 'PORK-BUN-1', size: 30 },
      availablePackages,
    ).then((options) => {
      console.log('options', options)
      done()
    }).catch((e) => {
      console.error('Error', e)
      done(e)
    })
  })

  it("should give multiple options for an order of 12 x 'PORK-BUN-1'", (done) => {
    OrderFulfillmentOptions.getOptions(
      { productCode: 'PORK-BUN-1', size: 12 },
      availablePackages,
    ).then((options) => {
      console.log('options', options)
      done()
    }).catch((e) => {
      console.error('Error', e)
      done(e)
    })
  })
})