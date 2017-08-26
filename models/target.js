const mongoose = require('mongoose')
const Schema = mongoose.Schema

let targetSchema = new Schema({
  line: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }.
  frequency: {
    type: String,
    enum: [daily, weekly, monthly],
    required: true
  },
  eachAmount: {
    type: number,
    required: true
  },
  saved: {
    type: number,
    required: true
  },
  picture: {
    type: String
  }
})

let Target = mongoose.model('Target', targetSchema)

module.exports = Target
