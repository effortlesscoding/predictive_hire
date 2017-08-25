const OrderLineFulfillment = require('./orderLineFulfillment')
const OrderException = require('./errors/orderException')
const _ = require('lodash')
const expect = require('chai').expect

describe('orderLineFulfillment', function() {


  describe('packages are empty', () => {
    it('it should prematurely exit with an error', (done) => {
      const call = () => OrderLineFulfillment.getOptions(
        { productCode: 'PORK-BUN-1', size: 1, },
        [],
      )
      expect(call).to.throw(OrderException)
      done()
    })
  })

  describe('3 packages are available', () => {
    const availablePackages = []
    before((done) => {
      availablePackages.push({ productCode: 'PORK-BUN-1', size: 7, priceCents: 115})
      availablePackages.push({ productCode: 'PORK-BUN-1', size: 20, priceCents: 225})
      availablePackages.push({ productCode: 'PORK-BUN-1', size: 71, priceCents: 2000})
      done()
    })

    describe('fulfillable requests', () => {

      it('should return size7x1 and size71x1 if order of size 78 is supplied', (done) => {
        const fulfillment = OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: 78, },
          availablePackages,
        )
        expect(fulfillment.quantity).to.be.equal(2)
        const packages = fulfillment.packages
        const size7 = _.find(packages, (p) => p.size === 7)
        const size20 = _.find(packages, (p) => p.size === 20)
        const size71 = _.find(packages, (p) => p.size === 71)
        expect(size7.quantity).to.be.equal(1)
        expect(size20.quantity).to.be.equal(0)
        expect(size71.quantity).to.be.equal(1)
        expect(fulfillment.totalPriceCents).to.equal(
          size7.priceCents * size7.quantity + 
          size20.priceCents * size20.quantity + 
          size71.priceCents * size71.quantity
        )
        done()
      })

      it('should return size20 x 7 if order of size 140 is supplied', (done) => {
        const fulfillment = OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: 140, },
          availablePackages,
        )
        expect(fulfillment.quantity).to.be.equal(7)
        const packages = fulfillment.packages
        const size7 = _.find(packages, (p) => p.size === 7)
        const size20 = _.find(packages, (p) => p.size === 20)
        const size71 = _.find(packages, (p) => p.size === 71)
        expect(size7.quantity).to.be.equal(0)
        expect(size20.quantity).to.be.equal(7)
        expect(size71.quantity).to.be.equal(0)
        expect(fulfillment.totalPriceCents).to.equal(
          size7.priceCents * size7.quantity + 
          size20.priceCents * size20.quantity + 
          size71.priceCents * size71.quantity
        )
        done()
      })

      it('should return a combination with 13 packages if 770 sized order is supplied', (done) => {
        const fulfillment = OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: 770, },
          availablePackages,
        )
        expect(fulfillment.quantity).to.be.equal(13)
        const packages = fulfillment.packages
        const size7 = _.find(packages, (p) => p.size === 7)
        const size20 = _.find(packages, (p) => p.size === 20)
        const size71 = _.find(packages, (p) => p.size === 71)
        expect(size7.quantity).to.be.equal(0)
        expect(size20.quantity).to.be.equal(3)
        expect(size71.quantity).to.be.equal(10)
        expect(fulfillment.totalPriceCents).to.equal(
          size7.priceCents * size7.quantity + 
          size20.priceCents * size20.quantity + 
          size71.priceCents * size71.quantity
        )
        done()
      })
    })

    describe('Unfulfillable requests', () => {
      
      it('should respond with an error if order size 0 is supplied', (done) => {
        const call = () => OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: 0, },
          availablePackages,
        )
        expect(call).to.throw(OrderException)
        done()
      })

      it("should respond with an error if an order with size 12 is supplied that cannot be fulfilled by available packages", (done) => {
        const call = () => OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: 12 },
          availablePackages,
        )
        expect(call).to.throw(OrderException)
        done()
      })

      it('should respond with an error if size is not specified', (done) => {
        const call = () => OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', },
          availablePackages,
        )
        expect(call).to.throw(OrderException)
        done()
      })

      it('should respond with an error if size is a number but not an integer', (done) => {
        const call = () => OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: 0.34, },
          availablePackages,
        )
        expect(call).to.throw(OrderException)
        done()
      })

      it('should respond with an error if size is null', (done) => {
        const call = () => OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: null, },
          availablePackages,
        )
        expect(call).to.throw(OrderException)
        done()
      })

      it('should respond with an error if size is an object', (done) => {
        const call = () => OrderLineFulfillment.getOptions(
          { productCode: 'PORK-BUN-1', size: '', },
          availablePackages,
        )
        expect(call).to.throw(OrderException)
        done()
      })
    })
  })

})