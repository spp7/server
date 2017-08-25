const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  isLogin: { type: Boolean, default: false },
  otp: {
    text: String,
    expirationDate: Date
  },
  fire: {
    Transfer: {
      FirstName: String,
      Address1: String,
      City: String,
      CountryID: String,
      AccountNumber: String,
      BankCodeType: String,
      BankCodeValue: String,
      BankCodeID: String
    },
    Authentication: {
      CorporateID: String,
      AccessCode: String,
      BranchCode: String,
      UserID: String,
      LocalID: String
    }
  },
  ewallet: {
    CustomerName: String,
    DateOfBirth: String,
    EmailAddress: String,
    CustomerNumber: String,
    IDNumber: String
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