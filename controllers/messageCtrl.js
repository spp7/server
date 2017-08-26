const Message = require('../models/message')

let create = ((req, res) => {
  let newMessage = new Message ({
    userId: req.body.userId,
    action: req.body.action,
    stepIdx: req.body.stepIdx,
    result: req.body.result
  })
  newMessage.save((err, createdMessage) => {
    res.send(err ? err : createdMessage)
  })
})

let showOne = ((req, res) => {
  let userId = req.params.id
  Message.findOne({userId: userId}, (err, message) => {
    res.send(err ? err : message)
  })
})

let update = ((req, res) => {
  let userId = req.params.id
  Message.findOne({userId: userId}, (err, message) => {
    message.stepIdx = req.body.stepIdx
    message.result.push(req.body.result)
    message.save((err, updatedMessage) => {
      res.send(err ? err : updatedMessage)
    })
  })
})

module.exports = {
  create,
  showOne,
  update
}
