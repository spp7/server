'use strict'
const express = require('express')
let router = express.Router()

const userCtrl = require('../controllers/userCtrl')

router.post('/', userCtrl.createUser) //v
router.get('/:line', userCtrl.getUserByLine) //v

module.exports  = router