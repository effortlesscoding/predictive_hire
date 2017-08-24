const OrderLineParser = require('./orderLineParser')
const OrderException = require('./errors/orderException')
const _ = require('lodash')
const expect = require('chai').expect

describe('orderLineParser', function() {
  it("should parse code '21 PORK-BUN'", (done) => {
    const code = '21 PORK-BUN'
    const orderLine = OrderLineParser.parse(code)
    expect(orderLine.productCode).to.be.equal('PORK-BUN')
    expect(orderLine.size).to.be.equal(21)
    done()
  })

  it("should NOT parse a code with multiple spaces like '21 PORK BUN'", (done) => {
    const code = '21 PORK BUN'
    const call = () => OrderLineParser.parse(code)
    expect(call).to.throw(OrderException)
    done()
  })

  it("should NOT parse a code with a non-integer order size like '21.1 PORK_BUN'", (done) => {
    const code = '21.1 PORK_BUN'
    const call = () => OrderLineParser.parse(code)
    expect(call).to.throw(OrderException)
    done()
  })

  it("should NOT parse a code with a non-integer order size like 'AA PORK_BUN'", (done) => {
    const code = 'AA PORK_BUN'
    const call = () => OrderLineParser.parse(code)
    expect(call).to.throw(OrderException)
    done()
  })
})