require('mongoose')
require('dotenv').config()

const axios = require('axios')

const Promo = require('../models/promo')
const MyPromo = require('../models/myPromo')
const User = require('../models/user')
const PoinHistory = require('../models/poinHistory')

const createPromo = (req, res) => {
  let promoData = {
    image: req.body.image || 'image2.jpg',
    title: req.body.title || 'Dufan',
    descr: req.body.descr || 'Main gratis di dufan',
    poin: req.body.poin || 1500,
    active: true
  }
  let promo = new Promo(promoData)

  promo.save((err, npromo) => {
    res.send(err? { err: err } : npromo)
  })
}

const getPromo = (req, res) => {
  Promo.find({},
    (err, promos) => {
      res.send(err? {err: err} : promos)
    }
  )
}

const getUserPromo = (req, res) => {
  let line = req.params.line
  MyPromo.find(
    {
      line : line
    },
    (err, promos) => {
      res.send(err? { err: err } : promos)
    }
  )
}

const createUserPromo = (req, res) => {
  Promo.find(
    { _promo: req.body.promoID},
    (err, promo) => {
      if (err) res.send({err: "Invalid Promo"})
      else {
        let poinNeeded = promo.poin
        User.find(
          { 'detail.line': req.body.line },
          (err, user) => {
            if (err) res.send({err : err})
            else if (user.currBalance < poinNeeded) res.send({err: `Insufficient Point. You need ${poinNeeded} but you only have ${user.currBalance}`})
            else {
              user.currBalance = user.currBalance - poinNeeded
              user.save((err, nuser) => {
                if (err) res.send({ err: err })
                else {
                  let poinHistoryData = {
                    'line': req.body.line,
                    'amount': poinNeeded,
                    'descr': `Use poin for promo "${promo.title}"`
                  }
                  let poinHistory = new PoinHistory(poinHistoryData)
                  poinHistory.save((err, npoinHistory) => {
                    if (err) res.send({ err: err})
                    else {
                      let myPromoData = {
                        line: req.body.line,
                        _promo: req.body.promo,
                        uniqueCode: `${req.body.line}_${new Date().toISOString()}`
                      }

                      let myPromo = new MyPromo(myPromoData)
                      myPromo.save((err, npromo) => {
                        res.send(err? {err: err} : npromo)
                      })
                    }
                  })
                }
              })
            }
          }
        )
      }
    }
  )
}

module.exports = {
  createPromo,
  getPromo,
  getUserPromo,
  createUserPromo
}
