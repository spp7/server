const mongoose = require('mongoose')
const Schema = mongoose.Schema

let promoSchema = new Schema({
  image: String,
  title: String,
  descr: String,
  poin: Number,
  active: Boolean
})

let Promo = mongoose.model('Promo', promoSchema)

module.exports = Promo