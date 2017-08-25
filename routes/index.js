'use strict'
const express = require('express')
let router = express.Router()


const loginCtrl = require('../controllers/loginCtrl')

router.get('/generateOTP/:line', loginCtrl.generateOTP) //v
router.post('/login', loginCtrl.login) //v
router.get('/logout/:line', loginCtrl.logout) //v

module.exports  = router