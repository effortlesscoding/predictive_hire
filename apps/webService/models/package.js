const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PackageSchema = new Schema({
  productCode: String,
  size: Number,
  priceCents: Number
}, { timestamps: true, })

module.exports = mongoose.model('Package', PackageSchema)