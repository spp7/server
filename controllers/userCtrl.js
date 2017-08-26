var qs = require('qs');
require('mongoose')
require('dotenv').config()
const SHA256 = require("crypto-js/sha256")
const crypto = require('crypto-js')

const axios = require('axios')

const User = require('../models/user')
const userdata = require('../config/user')

const generateToken = (req, res, callback) => {
  var headers = {
    "Authorization": "Basic MDBhMmNlY2YtNTdhOS00OTVkLWIzMzctMDUzNzk0ODFjZWEyOjkwZjg2NmYwLTBiYjEtNDE5Zi1iZmNjLWFiZDNjZTY1ZDBlMQ==",
    "Content-Type": "application/x-www-form-urlencoded"
  }
  var datas = {
    "grant_type":"client_credentials"
  }
  axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.headers.common['Authorization'] = 'Basic MDBhMmNlY2YtNTdhOS00OTVkLWIzMzctMDUzNzk0ODFjZWEyOjkwZjg2NmYwLTBiYjEtNDE5Zi1iZmNjLWFiZDNjZTY1ZDBlMQ=='
  axios.post('https://api.finhacks.id/api/oauth/token', qs.stringify(datas), headers)
  .then((res) => {
    callback(req,res,res.data.access_token)
  })
  .catch(err => {res.send(err)})
}

const testGetUser = (req, res) => {

  var headers = {
    "Authorization": "Basic MDBhMmNlY2YtNTdhOS00OTVkLWIzMzctMDUzNzk0ODFjZWEyOjkwZjg2NmYwLTBiYjEtNDE5Zi1iZmNjLWFiZDNjZTY1ZDBlMQ==",
    "Content-Type": "application/x-www-form-urlencoded"
  }
  var datas = {
    "grant_type":"client_credentials"
  }
  axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.headers.common['Authorization'] = 'Basic MDBhMmNlY2YtNTdhOS00OTVkLWIzMzctMDUzNzk0ODFjZWEyOjkwZjg2NmYwLTBiYjEtNDE5Zi1iZmNjLWFiZDNjZTY1ZDBlMQ=='
  axios.post('https://api.finhacks.id/api/oauth/token', qs.stringify(datas), headers)
  .then((res) => {
    token = res.data.access_token

    let apisecret = process.env.Business_API_Secret
    let k = `/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`
    let j = req.method
    let l = ""
    l = `${SHA256(l)}`.toLowerCase()
    l = l
    let g = token
    let h = new Date().toISOString().replace('Z','+07:00')
    let stringtosign = `${j}:${k}:${g}:${l}:${h}`
    stringtosign = `${crypto.HmacSHA1(apisecret,stringtosign)}`

    // "Origin": "182.16.165.75:3001",
    // "Content-Type": "application/json",
    // let header = {
    //   "Authorization": `Bearer ${g}`,
    //   "X-BCA-Key": process.env.Business_API_Key,
    //   "X-BCA-Timestamp": `${h}`,
    //   "X-BCA-Signature": stringtosign,
    // }

    axios.defaults.headers.common = {
      "Authorization": `Bearer ${g}`,
      "Content-Type": "application/json",
      "X-BCA-Key": process.env.Business_API_Key,
      "X-BCA-Timestamp": `${h}`,
      "X-BCA-Signature": stringtosign,
    }

    // console.log(header)
    axios.get(`${process.env.API_URL}${k}`)
    .then((result) => {console.log("ga error");res.send(result)})
    .catch(err => {console.log("masuk error"); res.send(err)})

  })
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