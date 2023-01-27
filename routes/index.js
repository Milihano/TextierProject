const express = require('express')
const router= express.Router()
const {register,verifyemailOtp} = require('../controllers/Register')
const {Login} = require('../controllers/Login')



router.post('/register',register)

router.get('/verify-email-OTP/:_otp/:email',verifyemailOtp)

router.get('/Login',Login)




module.exports = router