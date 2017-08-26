require('mongoose')
const Transfer = require('../models/transfer')
const User = require('../models/user')
var moment = require('moment-timezone')
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
const TIMEZONE = 'Asia/Jakarta'


const generateToken = (type, callback) => {
  let auth = process.env.Business_OAuth_Credential

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

const generateSignature = (userData, status ,callback) => {

  generateToken(function(token) {
    let a = 'POST'
    let b,c,d,e,f
    let i = ''

    b = `/banking/corporates/transfers`
    c = process.env.Business_Client_ID
    d = process.env.Business_Client_Secret
    e = process.env.Business_API_Key
    f = process.env.Business_API_Secret
    let g = token
    let h  = moment.tz(new Date(), TIMEZONE).format(DATE_FORMAT)
    let body = {
      CorporateID:userData.businessBanking.CorporateID,
      SourceAccountNumber:userData.businessBanking.AccountNumber,
      TransactionID:new Date().toISOString()+'_'+userData.detail.line,
      TransactionDate:h,
      ReferenceID:"12345/PO/2016",
      CurrencyCode:"IDR",
      Amount:req.body.amount,
      BeneficiaryAccountNumber:process.env.Business_Account_No_2,
      Remark1:status
    }
    i = JSON.stringify(body).replace(/\s/g, '')
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
      },
      body: JSON.stringify(body)
    }

    request(requestOptions, function (err, response, body) {
      if (body !== null){
        console.log(JSON.parse(body))
      }
      else console.log(err)

    })
  })
}

const createTransfer = (req, res) => {
  let now = new Date()
  let transferData = {
    year: now.getFullYear(),
    month: now.getMonth(),
    line: req.body.line,
    save: [{amount: req.body.save}],
    give: [{amount: req.body.give}],
    grow: [{amount: req.body.grow}],
    spend: [{amount: req.body.spend}],
    total: {
      save: total.save || 0 + parseInt(req.body.save),
      give: total.give || 0 + parseInt(req.body.give),
      grow: total.grow || 0 + parseInt(req.body.grow),
      spend: total.spend || 0 + parseInt(req.body.spend)
    }
  }

  let transfer = new Transfer(transferData)
  transfer.save((err, transfer) => {
    if (err) res.send({err:err})
    else {
      User.findOne({'detail.line': line}, (err,user)=>{
        user.balance = user.balance || 0 - parseInt(req.body.save) - parseInt(req.body.spend) - parseInt(req.body.grow) - parseInt(req.body.give)
        if (err) res.send({err: 'Line user not found'})
        else
          generateSignature(
            user,
            'Give',
            generateSignature(user,'Grow',
              function(){
                //spend ke e wallet
              }
            )
          )

      })
    }
    // res.send(err ? {err: err} : transfer)
  })
}

const updateTransfer = (req, res) => {
  let now = new Date()
  Transfer.findOne({
    year: now.getFullYear(),
    month: now.getMonth(),
    line: req.params.line
  },
  (err, transfer) => {
    if (err) res.send({ err: err })
    else {
      transfer.save.push({amount: req.body.save})
      transfer.give.push({amount: req.body.give})
      transfer.grow.push({amount: req.body.grow})
      transfer.spend.push({amount: req.body.spend})
      transfer.total = {
        save: transfer.total.save + parseInt(req.body.save),
        give: transfer.total.give + parseInt(req.body.give),
        grow: transfer.total.grow + parseInt(req.body.grow),
        spend: transfer.total.spend + parseInt(req.body.spend),
      }
      transfer.save((err, transfer) => {
        if (err) res.send(err)
        else {
          //spend
          // axios.post(`${process.env.API_URL}/ewallet/topup`, topupData)
          // .then((err,result) => {
          //   res.send(err? {err: err} : result)
          // })

        }
      })
    }
  })
}
module.exports = {
  createTransfer,
  updateTransfer
}
