const mongoose = require('mongoose');
const Schema = mongoose.Schema

let messageSchema = new Schema ({
  userId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  stepIdx: {
    type: Number,
    default: 1
  },
  result: {
    type: Array
  }
})

let Message = mongoose.model('Message', messageSchema)

module.exports = Message
