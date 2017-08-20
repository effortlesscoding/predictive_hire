const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PackageSchema = new Schema({
  _id: Schema.ObjectId,
  productCode: String,
  size: Number,
  priceCents: Number
}, {_id : false, timestamps: true })

module.exports = mongoose.model('Package', PackageSchema)