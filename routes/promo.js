'use strict'
const express = require('express')
let router = express.Router()

const promoCtrl = require('../controllers/promoCtrl')

router.post('/', promoCtrl.createPromo) //v
router.get('/', promoCtrl.getPromo) //v
router.get('/myPromo/:line', promoCtrl.getUserPromo) //
router.post('/myPromo', promoCtrl.createUserPromo) //

module.exports  = router