require('mongoose')
require('dotenv').config()

const axios = require('axios')

const User = require('../models/user')
const userdata = require('../config/user')

const createUser = (req, res) => {
  // axios.get(`${process.env.API_URL}/ewallet/customers/${process.env.CompanyCode}/${process.env.PrimaryID}`)
  axios.get('http://localhost:3000/api/sakuku_p/userInquiry/80173/081234567890')
  .then((result) => {
    let userData = {
      'otp': {},
      'fire': {
        'Transfer': {
          'FirstName': 'Poppy',
          'Address1': 'Taman Alfa Indah',
          'City': 'Jakarta Selatan',
          'CountryID': 'ID',
          'AccountNumber': process.env.Fire_Account_Number
        },
        'Authentication': {
          'CorporateID': process.env.Fire_Corporate_ID,
          'AccessCode': process.env.Fire_Access_Code,
          'BranchCode': process.env.Fire_Branch_Code,
          'UserID': process.env.Fire_User_ID,
          'LocalID': process.env.Fire_Local_ID
        }
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
      currBalance: result.Balance || 0,
      poin: 0
    }
    let user = new User(userData)

    user.save((err, nuser) => {
      res.send(err? { err: err } : nuser)
    })
  })
  .catch(err => { console.log(err) })
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
  getUserByLine
}
