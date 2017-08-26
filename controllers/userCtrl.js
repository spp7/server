require('mongoose')
require('dotenv').config()

const axios = require('axios')

const User = require('../models/user')
const userdata = require('../config/user')

const testGetUser = (req, res) => {
  console.log(`${process.env.API_URL}/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`)
  axios.get(`${process.env.API_URL}/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`)
  .then((result) => {res.send(result)})
  .catch(err => {res.send(err)})
}


const createUser = (req, res) => {
  //get balance
  axios.get(`${process.env.API_URL}/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`)
  .then((result) => {
    let accountNumber = result.AccountNumber
    let AvailableBalance = result.AvailableBalance

    axios.get(`${process.env.API_URL}/ewallet/customers/80173/081234567890`)
    .then((err,result) => {
      if (err) res.send({err:err})
      else {
        let userData = {
          'otp': {},
          'businessBanking': {
            'CorporateID': process.env.Corporate_ID_1,
            'AccountNumber': process.env.Business_Account_No_1
          },
          'ewallet': {
            'CustomerName': result.CustomerName,
            'DateOfBirth': result.DateOfBirth,
            'EmailAddress': result.EmailAddress || 'poppymighty@gmail.com',
            'CustomerNumber': result.CustomerNumber || '085813372797',
            'IDNumber': result.IDNumber
          },
          'detail': {
            'line': '@poppysp',
            'mobile': result.CustomerNumber || '085813372797',
            'email': result.EmailAddress || 'poppymighty@gmail.com'
          },
          currBalance: result.AvailableBalance || 0,
          poin: 0
        }
        let user = new User(userData)

        user.save((err, nuser) => {
          res.send(err? { err: err } : nuser)
        })

      }
    })

  })
  .catch(err => {
    console.log(err)
  })

}

const getUserByLine = (req, res) => {
  User.findOne({
    'detail.line': req.params.line
  }, (err, user) => {
    res.send(err? { err: err } : user)
  })
}

module.exports = {
  createUser,
  testGetUser,
  getUserByLine
}