const mongoose = require('mongoose')
const Schema = mongoose.Schema

let myPromoSchema = new Schema({
  // _user: { type: Schema.Types.ObjectId, ref: 'User' },
  line: String,
  _promo: { type: Schema.Types.ObjectId, ref: 'Promo' },
  uniqueCode: String,
  createdDate: { type: Date, default: Date.now() },
  expirationDate: { type: Date, default: +new Date() + 30*24*60*60*1000},
  active: { type: Boolean, default: true }
})

let MyPromo = mongoose.model('MyPromo', myPromoSchema)

module.exports = MyPromo