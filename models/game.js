const mongoose = require('mongoose')
const Schema = mongoose.Schema

let gameSchema = new Schema({
  descr : String
})

let Game = mongoose.model('Game', gameSchema)

module.exports = Game