require('module-alias/register')
const stream = require('stream')
const packages = require('@samples/packages')
const OrderStreamParser = require('./orderStreamParser')
const OrderException = require('./errors/orderException')
const _ = require('lodash')
const through2 = require('through2')
const expect = require('chai').expect

describe('orderStreamParser', function() {

  describe('formatOutput', () => {
    let input, fulfillment
    before(() => {
      input = {
        size: 16,
        productCode: 'TEST-1',
      }
      fulfillment = {
        packages: [
          { size: 3, quantity: 2, priceCents: 200, },
          { size: 5, quantity: 2, priceCents: 250, }
        ],
        totalPriceCents: 1000,
      }
    })

    it('should output expected text with proper currency decimals', () => {
      const text = new OrderStreamParser().formatOutput(input, fulfillment)
      const expectedText = ['16 TEST-1 $10.00', '  2 x 5 $2.50', '  2 x 3 $2.00', ''].join('\n')
      expect(text).to.equal(expectedText)
    })
  })

  // This is a bit of a multi-unit test
  it('should parse and transform for output via streams', (done) => {
    const parser = new OrderStreamParser(packages)
    const inputStream = stream.Readable()
    inputStream._read = (size) => {}
    const outputStream = through2((chunk, enc, cb) => {
      const expectedText = ['12 VS5 $27.96', '  4 x 3 $6.99', ''].join('\n')
      try {
        expect(chunk.toString()).to.equal(expectedText)
        done()
      } catch(e) {
        done(e)
      }
    })
    inputStream.pipe(parser).pipe(outputStream)
    inputStream.emit('data', '12 VS5')
    inputStream.emit('end')
  })

  it('should pipe the error message through', (done) => {
    const parser = new OrderStreamParser(packages)
    const inputStream = stream.Readable()
    inputStream._read = (size) => {}
    const outputStream = through2((chunk, enc, cb) => {
      expect(chunk.toString()).to.equal('Error -- Invalid order packages\n')
      done()
    })
    inputStream.pipe(parser).pipe(outputStream)
    inputStream.emit('data', '12 VS')
    inputStream.emit('end')
  })
})
