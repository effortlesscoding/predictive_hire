const OrderFulfillmentOptions = require('./orderFulfillmentOptions')
const Package = require('../../models/package')
const _ = require('lodash')
const expect = require('chai').expect

describe('orderFulfillmentOptions', function() {

  const availablePackages = []

  before((done) => {
    availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 7, priceCents: 115}))
    availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 20, priceCents: 225}))
    availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 71, priceCents: 2000}))
    done()
  })

  describe('fulfillable requests', () => {
    it('should return size7x1 and size71x1 if order of size 78 is supplied', (done) => {
      OrderFulfillmentOptions.getOptions(
        { productCode: 'PORK-BUN-1', size: 78, },
        availablePackages,
      ).then((options) => {
        const size7 = _.find(options, (o) => o.size === 7)
        const size20 = _.find(options, (o) => o.size === 20)
        const size71 = _.find(options, (o) => o.size === 71)
        expect(size7.quantityInQuote).to.be.equal(1)
        expect(size20.quantityInQuote).to.be.equal(0)
        expect(size71.quantityInQuote).to.be.equal(1)
        done()
      }).catch((e) => done(e))
    })

    it('should return size7x100 and size20x4 if order of size 780 is supplied', (done) => {
      OrderFulfillmentOptions.getOptions(
        { productCode: 'PORK-BUN-1', size: 780, },
        availablePackages,
      ).then((options) => {
        const size7 = _.find(options, (o) => o.size === 7)
        const size20 = _.find(options, (o) => o.size === 20)
        const size71 = _.find(options, (o) => o.size === 71)
        expect(size7.quantityInQuote).to.be.equal(100)
        expect(size20.quantityInQuote).to.be.equal(4)
        expect(size71.quantityInQuote).to.be.equal(0)
        done()
      }).catch((e) => done(e))
    })
  })

  describe('Unfulfillable requests', () => {

    it("should respond with an error if an order with size 12 is supplied that cannot be fulfilled by available packages", (done) => {
      OrderFulfillmentOptions.getOptions(
        { productCode: 'PORK-BUN-1', size: 12 },
        availablePackages,
      ).then((options) => {
        console.log('options', options)
        done(new Error('Unexpected success'))
      }).catch((e) => done())
    })

    it('should respond with an error if an order with size 0 is supplied that cannot be fulfilled by available packages', (done) => {
      OrderFulfillmentOptions.getOptions(
        { productCode: 'PORK-BUN-1', size: 0, },
        availablePackages,
      ).then((options) => {
        console.log('options', options)
        done(new Error('Unexpected success'))
      }).catch((e) => done())
    })

    it('should respond with an error if size is not specified', (done) => {
      OrderFulfillmentOptions.getOptions(
        { productCode: 'PORK-BUN-1', },
        availablePackages,
      ).then((options) => {
        console.log('options', options)
        done(new Error('Unexpected success'))
      }).catch((e) => done())
    })

    it('should respond with an error if size is not an integer', (done) => {
      OrderFulfillmentOptions.getOptions(
        { productCode: 'PORK-BUN-1', size: 0.34, },
        availablePackages,
      ).then((options) => {
        console.log('options', options)
        done(new Error('Unexpected success'))
      }).catch((e) => done())
    })
  })

})