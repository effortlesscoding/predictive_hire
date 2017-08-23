const OrderFulfillmentOptions = require('./orderFulfillmentOptions')
const Package = require('../../models/package')
const _ = require('lodash')
const expect = require('chai').expect

describe('orderFulfillmentOptions', function() {


  describe('packages are empty', () => {
    it('it should prematurely exit with an error', (done) => {
      new OrderFulfillmentOptions().getOptions(
        { productCode: 'PORK-BUN-1', size: 1, },
        [],
      )
      .then((options) => done(new Error('Unexpected success')))
      .catch((e) => done())
    })
  })

  describe.only('3 packages are available', () => {
    const availablePackages = []
    before((done) => {
      availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 7, priceCents: 115}).toObject({ versionKey: false, }))
      availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 20, priceCents: 225}).toObject({ versionKey: false, }))
      availablePackages.push(new Package({ productCode: 'PORK-BUN-1', size: 71, priceCents: 2000}).toObject({ versionKey: false, }))
      done()
    })

    describe('fulfillable requests', () => {

      it('should return size7x1 and size71x1 if order of size 78 is supplied', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: 78, },
          availablePackages,
        ).then((options) => {
          expect(options.length).to.be.equal(1)
          const packages = options[0]
          const size7 = _.find(packages, (p) => p.size === 7)
          const size20 = _.find(packages, (p) => p.size === 20)
          const size71 = _.find(packages, (p) => p.size === 71)
          expect(size7.quantity).to.be.equal(1)
          expect(size20.quantity).to.be.equal(0)
          expect(size71.quantity).to.be.equal(1)
          done()
        }).catch((e) => done(e))
      })

      it('should return 3 combinations if order of size 140 is supplied', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: 140, },
          availablePackages,
        ).then((options) => {
          expect(options.length).to.be.equal(3)
          options.forEach((optionPackages) => {
            let sum = 0
            optionPackages.forEach((p) => sum += p.size * p.quantity)
            expect(sum).to.be.equal(140)
          })
          done()
        }).catch((e) => done(e))
      })

      it('should return 35 various combinations of packages, each of which satisfy the 780 order', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: 780, },
          availablePackages,
        ).then((options) => {
          expect(options.length).to.be.equal(35)
          options.forEach((optionPackages) => {
            let sum = 0
            optionPackages.forEach((p) => sum += p.size * p.quantity)
            expect(sum).to.be.equal(780)
          })
          done()
        }).catch((e) => done(e))
      })

      it('should respond with 1 empty combination if order size 0 is supplied', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: 0, },
          availablePackages,
        )
        .then((options) => {
          expect(options.length).to.be.equal(1)
          options.forEach((optionPackages) => {
            let sum = 0
            optionPackages.forEach((p) => sum += p.size * p.quantity)
            expect(sum).to.be.equal(0)
          })
          done()
        })
        .catch((e) => done(e))
      })
    })

    describe('Unfulfillable requests', () => {

      it("should respond with an error if an order with size 12 is supplied that cannot be fulfilled by available packages", (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: 12 },
          availablePackages,
        )
        .then((options) => done(new Error('Unexpected success')))
        .catch((e) => done())
      })

      it('should respond with an error if size is not specified', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', },
          availablePackages,
        )
        .then((options) => done(new Error('Unexpected success')))
        .catch((e) => done())
      })

      it('should respond with an error if size is a number but not an integer', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: 0.34, },
          availablePackages,
        )
        .then((options) => done(new Error('Unexpected success')))
        .catch((e) => done())
      })

      it('should respond with an error if size is null', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: null, },
          availablePackages,
        )
        .then((options) => done(new Error('Unexpected success')))
        .catch((e) => done())
      })

      it('should respond with an error if size is an object', (done) => {
        new OrderFulfillmentOptions().getOptions(
          { productCode: 'PORK-BUN-1', size: '', },
          availablePackages,
        )
        .then((options) => done(new Error('Unexpected success')))
        .catch((e) => done())
      })
    })
  })

})