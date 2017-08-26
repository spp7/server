var qs = require('qs');
require('mongoose')
var request = require('request');
require('dotenv').config()
var moment = require('moment-timezone')
const SHA256 = require("crypto-js/sha256")
const crypto = require('crypto')
const axios = require('axios')
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
const TIMEZONE = 'Asia/Jakarta'

const User = require('../models/user')
const userdata = require('../config/user')

//const generateToken = (req, res, callback) => {
//	var headers = {
//		"Authorization": "Basic MWExZDI5YmMtMTVmMS00ZDRjLWJmZWQtZmM4MDUxMTIzNjlmOjA4ZDBlM2EzLWY2MDEtNDBlNy1hYzZiLTkyYzVjMjAzMzM4ZA==",
//		"Content-Type": "application/x-www-form-urlencoded"
//	}
//	var datas = {
//		"grant_type":"client_credentials"
//	}
//	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
//		axios.defaults.headers.common['Authorization'] = 'Basic MDBhMmNlY2YtNTdhOS00OTVkLWIzMzctMDUzNzk0ODFjZWEyOjkwZjg2NmYwLTBiYjEtNDE5Zi1iZmNjLWFiZDNjZTY1ZDBlMQ=='
//		axios.post('https://api.finhacks.id/api/oauth/token', qs.stringify(datas), headers)
//		.then((res) => {
//				callback(req,res,res.data.access_token)
//				})
//	.catch(err => {res.send(err)})
//}

const testGetUser = (req, res) => {
  let headers = {
    "Authorization": `Basic ${process.env.Business_OAuth_Credential}`,
    "Content-Type": "application/x-www-form-urlencoded"
  }
  let datas = {
    "grant_type":"client_credentials"
  }
  axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.headers.common['Authorization'] = 'Basic MWExZDI5YmMtMTVmMS00ZDRjLWJmZWQtZmM4MDUxMTIzNjlmOjA4ZDBlM2EzLWY2MDEtNDBlNy1hYzZiLTkyYzVjMjAzMzM4ZA=='
  axios.post('https://api.finhacks.id/api/oauth/token', qs.stringify(datas), headers)
    .then((result) => {
      let token = result.data.access_token

      let a = req.method
      let b = `/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`
      let c = process.env.Business_Client_ID
      let d = process.env.Business_Client_Secret
      let e = process.env.Business_API_Key
      let f = process.env.Business_API_Secret
      let g = token
      let i = ''
      let h  = moment.tz(new Date(), TIMEZONE).format(DATE_FORMAT)
      let j = a.toUpperCase()
      let k = encodeURI(b)
      let l = crypto.createHash('sha256').update(i).digest('hex').toLowerCase()
      //let l =  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      let m = h
      let o = crypto.createHmac('sha256', f).update('GET:' + k + ':' + g + ':' + l + ':' + h).digest('hex')

      let requestOptions = {
        url: `https://api.finhacks.id${b}`,
        method: 'GET',
        headers: {
          'X-BCA-KEY': e,
          'Content-Type': 'application/json',
          'X-BCA-TIMESTAMP': m,
          'Authorization': 'Bearer ' + g,
          'X-BCA-SIGNATURE': o
        }
      };

      request(requestOptions, function (err, response, body) {
        console.log(err)
        console.log('----------------------------------x')
        console.log(response)
        console.log('----------------------------------x')
        console.log(body)
        console.log('----------------------------------x')
      })
    })
    .catch(err => {
      res.send(err)
    })
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
