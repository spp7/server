var qs = require('qs');
require('mongoose')
var request = require('request');
require('dotenv').config()
var moment = require('moment-timezone')
const SHA256 = require("crypto-js/sha256")
// const crypto = require('crypto-js')
const crypto = require('crypto')
//const base64 = require('base-64')
const axios = require('axios')
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
const TIMEZONE = 'Asia/Jakarta'

const User = require('../models/user')
const userdata = require('../config/user')

const generateToken = (req, res, callback) => {
	var headers = {
		"Authorization": "Basic MWExZDI5YmMtMTVmMS00ZDRjLWJmZWQtZmM4MDUxMTIzNjlmOjA4ZDBlM2EzLWY2MDEtNDBlNy1hYzZiLTkyYzVjMjAzMzM4ZA==",
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
		"Authorization": "Basic MWExZDI5YmMtMTVmMS00ZDRjLWJmZWQtZmM4MDUxMTIzNjlmOjA4ZDBlM2EzLWY2MDEtNDBlNy1hYzZiLTkyYzVjMjAzMzM4ZA==",
		"Content-Type": "application/x-www-form-urlencoded"
	}
	var datas = {
		"grant_type":"client_credentials"
	}
	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
		axios.defaults.headers.common['Authorization'] = 'Basic MWExZDI5YmMtMTVmMS00ZDRjLWJmZWQtZmM4MDUxMTIzNjlmOjA4ZDBlM2EzLWY2MDEtNDBlNy1hYzZiLTkyYzVjMjAzMzM4ZA=='
		axios.post('https://api.finhacks.id/api/oauth/token', qs.stringify(datas), headers)
		.then((result) => {
				var token = result.data.access_token
				var a = req.method
				var b = `/banking/v4/corporates/finhacks05/accounts/8220000223`
				var c = '1a1d29bc-15f1-4d4c-bfed-fc805112369f'
				var d = '08d0e3a3-f601-40e7-ac6b-92c5c203338d'
				var e = 'd7fa151e-adb4-45d0-b1e9-4bd0910d7382'
				var f = 'c90290a9-423f-43ec-ad40-e61a784bbeaa'
				var g = token
				//var g = "gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a"
				var i = ''
				var h  = moment.tz(new Date(), TIMEZONE).format(DATE_FORMAT)
				//var h = "2017-03-17T09:44:18.000+07:00"
				// var h = `${new Date().toISOString().replace('Z','+07:00')}`
				console.log(h)
				var j = a.toUpperCase()
				var k = encodeURI(b)
				console.log(k)
				//var l = crypto.createHash('sha256').update(i).digest().toLowerCase()
				var l =  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"    
				//var m = h.toString() //moment.tz(new Date(), TIMEZONE).format(DATE_FORMAT)
				//var m = '2017-03-17T09:44:18.000+07:00'
				// var n = j+':'+k+':'+g+':'+l+':'+m
				var m = h
				//console.log(n)
				// var o = crypto.HmacSHA256(f, n).toString()

				var o = crypto.createHmac('sha256', f).update('GET:' + k + ':' + g + ':' + l + ':' + h).digest('hex')
				console.log('GET:' + k + ':' + g + ':' + l + ':' + h);
				//var o = crypto.createHmac('sha256', f).update('GET:' + k + ':' + g + ':' + l + ':' + h)
				console.log('OUTPUT:  ', o,l)

				var requestOptions = {
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
console.log('REQUEST OPTIONS', requestOptions)

		request(requestOptions, function (err, response, body) {
				console.log(err)
				console.log('----------------------------------x')
				console.log(response)
				console.log('----------------------------------x')
				console.log(body)
				console.log('----------------------------------x')
				})

		// axios.defaults.headers.common["Authorization"] = `Bearer ${g}`
		// axios.defaults.headers.common["Origin"] = "182.16.165.75:3001"
		// axios.defaults.headers.common["X-BCA-Key"] = e
		// axios.defaults.headers.common["X-BCA-Timestamp"] = h
		// axios.defaults.headers.common["X-BCA-Signature"] = o
		// var uri = `https://api.finhacks.id${b}`
		// var headers = {
		//   "Authorization" : `Bearer ${g}`,
		//   "Origin": "182.16.165.75:3001",
		//   "X-BCA-Key": e,
		//   "X-BCA-Timestamp": h,
		//   "X-BCA-Signature": o
		// }
		//
		// axios.get(uri, qs.stringify({}), headers)
		// .then((result) => {console.log("ga error 2");res.send(result)})
		// .catch(err => {console.log("masuk error 2"); res.send(err)})

		})
	.catch(err => {res.send(err)})




}



const createUser = (req, res) => {
	//get balance
	axios.get(`${process.env.API_URL}/banking/v4/corporates/${process.env.Business_Corporate_ID}/accounts/${process.env.Business_Account_No_1}`)
		.then((result) => {
				var accountNumber = result.AccountNumber
				var AvailableBalance = result.AvailableBalance

				axios.get(`${process.env.API_URL}/ewalvar/customers/80173/081234567890`)
				.then((err,result) => {
					if (err) res.send({err:err})
					else {
					var userData = {
					'otp': {},
					'businessBanking': {
					'CorporateID': process.env.Corporate_ID_1,
					'AccountNumber': process.env.Business_Account_No_1
					},
					'ewalvar': {
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
					var user = new User(userData)

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
