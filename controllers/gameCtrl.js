require('mongoose')
const Game = require('../models/game')
const util = require('../helpers/util')

const createGame = (req, res) => {
  let game = new Game({ descr: req.body.descr })
  game.save((err,ngame) => {
    res.send(err? {err: err} : ngame)
  })
}

const getGame = (req, res) => {
  Game.find({},
    (err, games) => {
      res.send(err? {err: err} : games)
    })
}

const putGame = (req, res) => {
  Game.find({
    _id: req.params.id
  },
    (err, games) => {
      if (err) res.send({ err: err })
      else {
        game.descr = req.body.descr
        game.save( (err, game) => {
          res.send(err? {err: err} : games)
        })
      }
    })
}

module.exports = {
  createGame,
  getGame,
  putGame
}