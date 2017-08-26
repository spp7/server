require('mongoose')
const Transfer = require('../models/transfer')

const createTransfer = (req, res) => {
  let now = new Date()
  let transferData = {
    year: now.getFullYear(),
    month: now.getMonth(),
    line: req.body.line,
    save: [{amount: req.body.save}],
    give: [{amount: req.body.give}],
    grow: [{amount: req.body.grow}],
    spend: [{amount: req.body.spend}],
    total: {
      save: req.body.save,
      give: req.body.give,
      grow: req.body.grow,
      spend: req.body.spend
    }
  }

  let transfer = new Transfer(transferData)
  transfer.save((err, transfer) => {
    res.send(err ? {err: err} : transfer)
  })
}

const updateTransfer = (req, res) => {
  let now = new Date()
  Transfer.findOne({
    year: now.getFullYear(),
    month: now.getMonth(),
    line: req.params.line
  },
  (err, transfer) => {
    if (err) res.send({ err: err })
    else {
      transfer.save.push({amount: req.body.save})
      transfer.give.push({amount: req.body.give})
      transfer.grow.push({amount: req.body.grow})
      transfer.spend.push({amount: req.body.spend})
      transfer.total = {
        save: transfer.total.save + parseInt(req.body.save),
        give: transfer.total.give + parseInt(req.body.give),
        grow: transfer.total.grow + parseInt(req.body.grow),
        spend: transfer.total.spend + parseInt(req.body.spend),
      }
      transfer.save((err, transfer) => {
        if (err) res.send(err)
        else {
          //spend
          axios.post(`${process.env.API_URL}/ewallet/topup`, topupData)
          .then((err,result) => {
            res.send(err? {err: err} : result)
          })

        }
      })
    }
  })
}
module.exports = {
  createTransfer,
  updateTransfer
}