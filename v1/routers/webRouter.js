const express = require('express')
const router = express.Router()

const webController = require('../controllers/webController')

router.post('/addTuition', webController.addTuition)
router.post('/unpaidTuitionStatus', webController.unpaidTuitionStatus)

module.exports = router
