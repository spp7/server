const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  isLogin: { type: Boolean, default: false },
  otp: {
    text: String,
    expirationDate: Date
  },
  businessBanking : {
    CorporateID: String,
    AccountNumber: String
  },
  ewallet: {
    CustomerName: String,
    DateOfBirth: String,
    EmailAddress: String,
    CustomerNumber: String,
    IDNumber: String,
    CompanyCode: String,
    PrimaryID: String
  },
  detail: {
    line: String,
    mobile: String,
    email: String
  },
  currBalance: Number,
  poin: Number
})

let User = mongoose.model('User', userSchema)

module.exports = User
