require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.APP_PORT
const router = require('./routes/index')



app.use(bodyParser.json())
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})