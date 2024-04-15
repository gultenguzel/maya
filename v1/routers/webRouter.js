const express = require('express')
const router = express.Router()

const webController = require('../controllers/webController')

router.post('/addTuiton', webController.addTuiton)
router.post('/unpaidTutionStatus', webController.unpaidTutionStatus)

module.exports = router
