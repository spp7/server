const mongoose = require('mongoose')
const Schema = mongoose.Schema

let poinHistorySchema = new Schema({
  line: String,
  // _user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdDate: { type: Date, default: Date.now() },
  amount: Number,
  descr: String
})

let PoinHistory = mongoose.model('PoinHistory', poinHistorySchema)

module.exports = PoinHistory