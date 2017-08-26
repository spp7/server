'use strict'
const express = require('express')
let router = express.Router()

const transferCtrl = require('../controllers/transferCtrl')

router.post('/', transferCtrl.createTransfer) //
router.put('/:line', transferCtrl.updateTransfer) //

module.exports  = router