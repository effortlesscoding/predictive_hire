
const OrderParser = require('./orderParser')
const _ = require('lodash')
const expect = require('chai').expect

describe('orderParser', function() {
  it("should parse code '21 PORK-BUN'", (done) => {
    const code = '21 PORK-BUN'
    OrderParser.parse(code)
      .then((order) => {
        expect(order.productCode).to.be.equal('PORK-BUN')
        expect(order.size).to.be.equal(21)
        done()
      })
      .catch((e) => done(e))
  })

  it("should NOT parse a code with multiple spaces like '21 PORK BUN'", (done) => {
    const code = '21 PORK BUN'
    OrderParser.parse(code)
      .then((order) => done(new Error('Unexpected success')))
      .catch((e) => done())
  })

  it("should NOT parse a code with a non-integer order size like '21.1 PORK BUN'", (done) => {
    const code = '21 PORK BUN'
    OrderParser.parse(code)
      .then((order) => done(new Error('Unexpected success')))
      .catch((e) => done())
  })

  it("should NOT parse a code with a non-integer order size like 'AA PORK BUN'", (done) => {
    const code = '21 PORK BUN'
    OrderParser.parse(code)
      .then((order) => done(new Error('Unexpected success')))
      .catch((e) => done())
  })
})