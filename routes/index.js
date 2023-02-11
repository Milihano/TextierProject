const express = require('express')
const router= express.Router()
const {register,verifyemailOtp,resendEmailOtp,showprofile} = require('../controllers/Register')
const {Login} = require('../controllers/Login')
const {authorization} = require('../middlewares/authorization')
const {Updatecustomer} = require('../controllers/Update')
const {changepassword} = require('../controllers/changepassword')
const {forgetpassword,verifyFPotp,updatepasswordforFP} = require('../controllers/forgetpassword')



router.post('/register',register)

router.get('/verify-email-OTP/:_otp/:email',verifyemailOtp)

router.get('/resend-OTP/:email',resendEmailOtp)

router.get('/Login',Login)

router.put('/update',authorization,Updatecustomer)

router.get('/profile',authorization,showprofile)

router.put('/changepassword',authorization,changepassword)

router.get('/forget_password',forgetpassword)

router.get('/verifyFPOtp/:_otp/:email', verifyFPotp)




module.exports = router