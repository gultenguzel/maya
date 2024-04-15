const express = require('express')
const router = express.Router()

const bankingController = require('../controllers/bankingController')

router.post('/querytuition', bankingController.balanceandtotaltuition)
router.post('/paytuition', bankingController.payTuition)


module.exports = router
