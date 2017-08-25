const mongoose = require('mongoose')
const Schema = mongoose.Schema

let poinSchema = new Schema({
  poin : String,
  amount: Number,
  active: Boolean
})

let Poin = mongoose.model('Poin', poinSchema)

module.exports = Poin