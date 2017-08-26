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
  .then((result) => {
    let token = result.data.access_token

    let a = req.method
    let b = `/banking/v4/corporates/finhacks01/accounts/8220000011`
    let c = '00a2cecf-57a9-495d-b337-05379481cea2'
    let d = '90f866f0-0bb1-419f-bfcc-abd3ce65d0e1'
    let e = '1b6e44be-df70-4013-8a75-3d7abd2a8046'
    let f = '60766ed9-2480-4f47-ab3f-68a5a719b54d'
    let g = token
    let i = ''
    let h = new Date().toISOString().replace('Z','+07:00')
    let j = a.toUpperCase()
    let k = encodeURI(b)
    let l = `${SHA256('')}`.toLowerCase()
    let m = new Date().toISOString().replace('Z','+07:00')
    let n = j+':'+k+':'+g+':'+l+':'+m
    //console.log(n)
    let o = crypto.HmacSHA1(f, n).toString()
    //console.log(o)
    //console.log('----xxx')

    axios.defaults.headers.common["Authorization"] = `Bearer ${g}`
    //console.log(axios.defaults.headers.common["Authorization"])
    //console.log('-----------1')
    // axios.defaults.headers.common["Content-Type"] = "application/json"
    axios.defaults.headers.common["Origin"] = "182.16.165.75:3001"
    axios.defaults.headers.common["X-BCA-Key"] = e
    //console.log(axios.defaults.headers.common["X-BCA-Key"])
    //console.log('-----------2')
    axios.defaults.headers.common["X-BCA-Timestamp"] = h
    //console.log(axios.defaults.headers.common["X-BCA-Timestamp"])
    //console.log('-------------3')
    axios.defaults.headers.common["X-BCA-Signature"] = o
    //console.log(axios.defaults.headers.common["X-BCA-Signature"])
    //console.log('-------------4')
    let uri = `https://api.finhacks.id${b}`
    //console.log(uri)
    //console.log('---------------xx')

    var headers = {
      "Authorization" : `Bearer ${g}`,
      "Origin": "182.16.165.75:3001",
      "X-BCA-Key": e,
      "X-BCA-Timestamp": h,
      "X-BCA-Signature": o
    }

    console.log(headers)
    console.log(axios.defaults.headers.common)
    axios.get(uri, qs.stringify({}), headers)
    .then((result) => {console.log("ga error 2");res.send(result)})
    .catch(err => {console.log("masuk error 2"); res.send(err)})

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