require('mongoose')
require('dotenv').config()
const SHA256 = require("crypto-js/sha256")
const HmacSHA1 = require('crypto-js/HmacSHA1')

const axios = require('axios')

const User = require('../models/user')
const userdata = require('../config/user')

const testGetUser = (req, res) => {
  let apisecret = process.env.Business_API_Secret
  let k = `/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`
  let j = req.method
  let l = req.body.replace(/\s/g, '') || ''
  l = SHA256(l).toLowerCase()
  let g = process.env.Business_OAuth_Credential
  let h = new Date().toISOString()
  let stringtosign = `${j}:${k}:${g}:${l}:${h}`
  console.log(stringtosign)
  stringtosign = HmacSHA1(stringtosign)
  console.log(stringtosign)
  axios.get(`${process.env.API_URL}${uri}`, {
    'Authorization': `Bearer ${g}`,
    'Content-Type': 'application/json',
    'Origin': '182.16.165.75:3001',
    'X-BCA-Key	': process.env.Business_API_Key,
    'X-BCA-Timestamp': `${h}`,
    'X-BCA-Signature': stringtosign,
  })
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