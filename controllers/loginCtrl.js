require('mongoose')
const User = require('../models/user')
const util = require('../helpers/util')

const generateOTP = (req, res) => {
  let otp = util.generateOTP()

  User.findOne(
    {
      'detail.line': req.params.line
    },
    (err, user) => {
      if (err) res.send({ err: err })
      else {
        let currDate = new Date()
        user.otp = {
          'text' : otp,
          'expirationDate': currDate.setMinutes(currDate.getMinutes() + 5)
        }

        user.save((err, n_user) => {
          if (err) res.send({err: err})
          else res.send({otp: n_user.otp}) //taredit jadi sms
        })
      }
    }
  )
}

const login = (req, res) => {
  if (typeof req.body.otp === 'undefined') res.send({ err: 'OTP must be filled' })
  else
    User.findOne(
      {
        'detail.line': req.body.line
      },
      (err, user) => {
        if (err) res.send({ err: err })
        else if (typeof user.otp.text === 'undefined' || user.otp.text !== req.body.otp ) res.send({err: 'Wrong OTP'})
        else if (user.otp.expirationDate < new Date() ) res.send({ err: 'OTP has been expired' })
        else {
          user.isLogin = true
          user.otp = {}
          user.save((err, nuser) => {
            res.send(err? { err: err }: 'Login Success')
          })
        }
      }
    )

}

const logout = (req, res) => {
  User.findOne(
    {
      'detail.line': req.params.line
    },
    (err, user) => {
      if (err) res.send({ err: err })
      else {
        user.isLogin = false
        user.save((err, nuser) => {
          res.send(err? { err: err }: 'Logout')
        })
      }
    }
  )
}

module.exports = {
  generateOTP,
  login,
  logout
}