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

const generateToken = (type, callback) => {
  let auth
  if (type == 'business') auth = process.env.Business_OAuth_Credential
  else if (type == 'ewallet') auth = process.env.Wallet_OAuth_Credential

  let headers = {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded"
  }
  let datas = {
    "grant_type":"client_credentials"
  }
  axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.headers.common['Authorization'] = `Basic ${auth}`
  axios.post('https://api.finhacks.id/api/oauth/token', qs.stringify(datas), headers)
  .then((result) => {
    let token = result.data.access_token
    callback(token)
  })
  .catch(err => {
    console.log('error di token')
    console.log(err)
  })
}

const generateSignature = (method, type ,callback) => {

  generateToken(type, function(token) {
    let a = method
    let b,c,d,e,f
    let i = ''
    let body = {CustomerName:'John Doe',DateOfBirth:'2000-05-20',PrimaryID:'081234567890',MobileNumber:'085813372797',EmailAddress:'user@bca.co.id',CompanyCode:process.env.Wallet_Company_Code,CustomerNumber:'1111111112',IDNumber:'1234567890123456'}

    if (type == 'business') {
      b = `/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`
      c = process.env.Business_Client_ID
      d = process.env.Business_Client_Secret
      e = process.env.Business_API_Key
      f = process.env.Business_API_Secret
    } else if (type === 'ewallet') {
      b = method === 'GET' ? `/ewallet/customers/${process.env.Wallet_Company_Code}/081234567890` : '/ewallet/customers'
      c = process.env.Wallet_ClientID
      d = process.env.Wallet_Client_Secret
      e = process.env.Wallet_API_Key
      f = process.env.Wallet_API_Secret
      if (method == 'POST') {
        // i = {CustomerName:'JohnDoe',DateOfBirth:'2000-05-20',PrimaryID:'081234567890',MobileNumber:'085813372797',EmailAddress:'user@bca.co.id',CompanyCode:process.env.Wallet_Company_Code,CustomerNumber:'1111111112',IDNumber:'1234567890123456'}
        i = JSON.stringify(body).replace(/\s/g, '')
      }
    }

    let g = token
    let h  = moment.tz(new Date(), TIMEZONE).format(DATE_FORMAT)
    let j = a.toUpperCase()
    let k = encodeURI(b)
    let l = crypto.createHash('sha256').update(i).digest('hex').toLowerCase()
    let m = h
    let o = crypto.createHmac('sha256', f).update(a+':' + k + ':' + g + ':' + l + ':' + h).digest('hex')

    let requestOptions = {
      url: `https://api.finhacks.id${b}`,
      method: a,
      headers: {
        'X-BCA-KEY': e,
        'Content-Type': 'application/json',
        'X-BCA-TIMESTAMP': m,
        'Authorization': 'Bearer ' + g,
        'X-BCA-SIGNATURE': o
      }
    };

    if (type === 'ewallet' && method === 'POST') {
      requestOptions.body = JSON.stringify(body)
      // console.log(requestOptions)
    }

    request(requestOptions, function (err, response, body) {
      if (body !== null){
        if (type === 'business') {
          let userData = JSON.parse(body).AccountDetailDataSuccess
          console.log('business')
          console.log(userData)
          callback('GET',userData)
        }
        else if (type === 'ewallet') {
          console.log('method', method)
          console.log('ada body')
          console.log(JSON.parse(body) )
          console.log('------------------')
	        callback(JSON.parse(body))
        }
      }
      else console.log(err)

    })
  })
}

const testGetUser = (req, res) => {
  generateBusiness(req.method)
}

const generateBusiness = (method) => {
  generateSignature(method,'business', createWallet)
}

const createWallet = (userData) => {
  generateSignature('POST','ewallet', function(data) {
    // let companyCode = data.CompanyCode
    // let primaryID = data.PrimaryID
    generateWallet('GET',userData,data)
  })
}
const generateWallet = (method, userData, walletData) => {
  let accountNumber = userData[0].AccountNumber
  let availableBalance = userData[0].AvailableBalance

  generateSignature(method,'ewallet', function(data) {
    let user = {
      otp : {},
      'businessBanking': {
        'CorporateID': process.env.Business_Corporate_ID,
        'AccountNumber': process.env.Business_Account_No_1
      },
      'ewallet': {
        'CustomerName': data.CustomerName,
        'DateOfBirth': data.DateOfBirth,
        'EmailAddress': data.EmailAddress || 'poppymighty@gmail.com',
        'CustomerNumber': data.CustomerNumber || '085813372797',
        'IDNumber': data.IDNumber,
        'CompanyCode': process.env.Wallet_Company_Code,
        'PrimaryID': '081234567890'

      },
      'detail': {
        'line': '@poppysp',
        'mobile': data.CustomerNumber || '085813372797',
        'email': data.EmailAddress || 'poppymighty@gmail.com'
      },
      currBalance: data.AvailableBalance || 0,
      poin: 0
    }

    let nuser = new User(user)
    nuser.save((err, nuser) => {
      console.log(err? err : nuser)
    })

  })
}

const createUser = (req, res) => {
  generateBusiness('GET')
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

