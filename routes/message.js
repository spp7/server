'use strict'
const express = require('express')
let router = express.Router()

const messageCtrl = require('../controllers/messageCtrl')

router.post('/', messageCtrl.create)
router.get('/:id', messageCtrl.showOne)
router.put('/:id', messageCtrl.update)

module.exports = router
