const express = require('express')
const app = express()
const bankingRouter = require('./routers/bankingRouter.js')
const webRouter = require('./routers/webRouter.js')
const mobileRouter = require('./routers/mobileRouter.js')
const { Pool } = require('pg')
const bodyParser = require('body-parser')
const Joi = require('joi');
app.use(express.json());
const jwt = require('jsonwebtoken')

app.use(bodyParser.json())

app.use('/api/banking', bankingRouter)
app.use('/api/web', webRouter)
app.use('/api/mobile', mobileRouter)

app.get('/', function (req, res) {
  res.send('Hello World')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`)
})
