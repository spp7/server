const mongoose = require('mongoose')
const Schema = mongoose.Schema

let TransferSchema = new Schema({
  // _user: { type: Schema.Type.ObjectId, ref: 'User' },
  line: String,
  year: Number,
  month: Number,
  saving: [{
    createdDate: { type: Date, default: Date.now() },
    amount: Number
    }],
  give: [{
    createdDate: { type: Date, default: Date.now() },
    amount: Number
    }],
  grow: [{
    createdDate: { type: Date, default: Date.now() },
    amount: Number
    }],
  spend: [{
    createdDate: { type: Date, default: Date.now() },
    amount: Number
    }],
  total: {
    saving: Number,
    give: Number,
    grow: Number,
    spend: Number
  }
})

let Transfer = mongoose.model('Transfer', TransferSchema)

module.exports = Transfer
