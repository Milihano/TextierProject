require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize")
const {registerValidation} = require('../validations/joiregistervalidation')
const {generateotp,password_hash} = require('../utils/otp&hashing')
const {Otp} = require('../models');
const {User} = require('../models')
const jwt = require('jsonwebtoken')
const {sendEmail}= require('../services/emailotp')
//const {resetpassword} = require('../controllers/resetpassword')

//challenge
//Tryin to find a way to stop my code from keeping/collecting data after validation is not met with....


const register = async (req,res) => {

    const _otp = generateotp()


    const {error,value} = registerValidation(req.body)

    if (error != undefined) {
      res.status(400).json({
        status:false,
        message: error.details[0].message
    })   
    }
        const {fullname,username,password,repeat_password,email,gender,dob,country,phone} = req.body

        const customer_id = uuidv4();

        // console.log("here 1(gender):",gender)
        
        

    try {
        User.findAll({
            where: {
                [Op.or]: [
                    {username: username},
                    {email:email}
                ]
            }
        })
        .then((data)=>{
            if (data.length > 0) {
                throw new Error(`Email or Username already Exist`)
            }
            return password_hash(password)
        })
        .then(([hash,salt])=>{
            User.create({
                customer_id: customer_id,
                fullname: fullname, 
                username: username,
                password_hash: hash,
                password_salt: salt,
                email:email,
                gender:gender,
                dob:dob,
                phone_number:phone,
                country:country,
            });
        })
        .then((data)=>{
            return Otp.create({
        
                Otp: _otp,
                email: email,
                phone:phone
            })
        })
        
        .then((sendOtp)=>{
            sendEmail(email,'OTP',`Hello ${fullname} This is The Otp Code, Do Not Share With Anyone \n ${_otp}`)
            
        
            res.status(200).json({
                status:true,
                message:`Otp has been successfully sent`
            })
        })
        .catch((err)=>{
            console.log('here1:',err)
            res.status(400).json({
                status:false,
                message:err.message
            })
        })
    } catch (e) {
        console.log('here2:',e)
        res.status(400).json({
            status:false,
            message:e.message
        })
    }
}

const verifyemailOtp = async (req,res)=>{

    const {email,_otp}=req.params
    try {
        Otp.findAll({
            where: {
                [Op.and]: [
                    {email: email},
                    {otp:_otp}
                ]
            }
        })
        // console.log('this otp:',data)
        .then((otpDataFetched) => {
            //console.log(otpDataFetched)
            if (otpDataFetched.length == 0) throw new Error('Invalid OTP')
    
            console.log("otpdataFetched: ", otpDataFetched[0])

            const timeOtpWasSent = Date.now() - new Date(otpDataFetched[0].dataValues.createdAt)
        
            const convertToMin = Math.floor(timeOtpWasSent / 60000) // 60000 is the number of milliseconds in a minute

            if (convertToMin > process.env.OTPExpirationTime) throw new Error('OTP has expired')

            return User.update({ is_email_verified: true }, {
                where: {
                  email: email
                }
            })
        })
        .then((data)=>{
            Otp.destroy({
                where: {
                    otp: _otp,
                    email: email
                }
            }) 
            res.status(200).send({
                status:true,
                message:`Successfully Created.`
            })
        })
        .catch((err)=>{
            console.log('here2:',err)
            res.status(400).json({
                status:false,
                message:err.message
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })  
    }
        
}
const resendEmailOtp = async (req, res) => {

    const { email } = req.params
    const newOtp = generateOtp()

    try { 

        const findOtpWithEmail =   await Otp.findAll({ where: { email: email } })
        
        if (findOtpWithEmail.length == 0) throw new Error('Email does not exist')
   
        await Otp.destroy({  where: {  email: email } })

        await Otp.create({ otp: newOtp, email: email })
        
        sendEmail(email, 'RESEND OTP', `Hello, your new otp is ${newOtp}`)  

        res.status(200).send({
            status: true,
            message: 'otp resent to email'
        })


     

    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: false,
            message: e.message || "Some error occurred"
        })
    }




}

const showprofile = async (req, res) => { 

    const { customer_id } = req.params.userData //from the authorization middleware
    const UserData = await User.findOne({ where: { customer_id: customer_id } })
    
    console.log('Here for profile',UserData)
    delete UserData.dataValues.password_hash
    delete UserData.dataValues.password_salt
    delete UserData.dataValues.customer_id
    delete UserData.dataValues.id
    delete UserData.dataValues.is_email_verified
    delete UserData.dataValues.is_phone_number_verified
    delete UserData.dataValues.createdAt
    delete UserData.dataValues.updatedAt

    // UserData.dataValues.accts = accountData


    res.status(200).send({
        status: true,
        message: 'Customer details successfully fetched',
        data: UserData
    })
        

}



module.exports = {register,verifyemailOtp,resendEmailOtp,showprofile}

    





