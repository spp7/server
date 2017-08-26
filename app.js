require('dotenv').config()

const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

let user = require('./routes/user')
let index = require('./routes/index')
let promo = require('./routes/promo')
let game = require('./routes/game')
let transfer = require('./routes/transfer')

let env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3001
const db_config = {
  'development' : 'mongodb://hacktivex:hacktivex@ds159953.mlab.com:59953/hacktivex',
  'production': ''
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

app.use('/api/user', user)
app.use('/api/game', game)
app.use('/api/promo', promo)
app.use('/api/transfer', transfer)
app.use('/api', index)

mongoose.connect(db_config[env], (err,res) => {
  console.log(err ? err : `Connected to ${db_config[env]}`)
})

app.set('port', port)
app.listen(app.get('port'), () => {
  console.log(`Connected to port ${app.get('port')}`)
})

module.exports = app

