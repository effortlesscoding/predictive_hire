
const PackageSerializer = (p) => {
  return {
    productCode: p.productCode,
    size: p.size,
    priceCents: p.priceCents,
    quantity: p.quantity
  }
}

module.exports = PackageSerializer