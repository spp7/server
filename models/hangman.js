const mongoose = require('mongoose')
const Schema = mongoose.Schema

let hangmanSchema = new Schema({
  keyword : String
})

let Hangman = mongoose.model('Hangman', hangmanSchema)

module.exports = Hangman