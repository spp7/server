const mongoose = require('mongoose')
const Schema = mongoose.Schema

let quizSchema = new Schema({
  image: String,
  question: String,
  choice: String,
  answer: String
})

let Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz