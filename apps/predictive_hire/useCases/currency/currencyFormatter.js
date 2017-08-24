
class CurrencyFormatter {
  format(cents, symbol) {
    return `${symbol}${(cents / 100).toFixed(2)}`
  }
}

module.exports = new CurrencyFormatter()