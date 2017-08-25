'use strict'
const express = require('express')
let router = express.Router()

const gameCtrl = require('../controllers/gameCtrl')

router.post('/', gameCtrl.createGame) //
router.get('/', gameCtrl.getGame) //
router.post('/:id', gameCtrl.createGame) //


module.exports  = router