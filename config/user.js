require('dotenv').config()

const fire = {
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
}

const wallet = {
  'CompanyCode' : process.env.Wallet_Company_Code
}

module.exports = {
  fire
}