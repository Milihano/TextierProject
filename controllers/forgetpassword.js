const {User} = require('../models')
const {Otp} = require('../models')
const { Op } = require("sequelize")
const {generateotp,password_hash} = require('../utils/otp&hashing')
const {sendEmail} = require('../services/emailotp')
const {forgetpasswordValidation}= require('../validations/forgetpasswordvalidation')


//Giving Error "Cannot destructure property 'username' "

const forgetpassword = async (req,res)=>{
    const _otp = generateotp()
    //email
    //check if email exist in the customer table
    //if yes, sedn an otp to the email
    //if no. just move ahead

    const {error,value} = forgetpasswordValidation(req.body)
    //console.log("error:", error)
    if (error) {
        res.status(400).json({
            status:false,
            message: error.details[0].message
        })
    }
    
    const{email} = req.body

    User.findAll({
        where: {
            email:email
        }
    })
    .then((data)=>{
        if (data.length==0) {
            res.status(400).json({
                status:false,
                message:`Username or Email Does Not Exist`
            })
        }
    })

    .then((data)=>{
        return Otp.create({
    
            Otp: _otp,
            email: email
        })

    })
    .then((data)=>{
        sendEmail(email,'OTP',`Hello ${email} This is The Otp Code, Do Not Share With Anyone \n ${_otp}`)
        
    
        res.status(200).json({
            status:true,
            message:`Otp has been successfully sent`
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
const verifyFPotp= async (req,res)=>{
    const {_otp,email} = req.params
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
        .then((otpdata) => {
            // console.log(otpdata)
            if(otpdata.length == 0) throw new Error('Invalid OTP')
    
            console.log("otpdataFetched: ", otpdata[0])

            const timeOtpWasSent = Date.now() - new Date(otpdata[0].dataValues.createdAt)
        
            const convertToMin = Math.floor(timeOtpWasSent / 60000) // 60000 is the number of milliseconds in a minute

            if (convertToMin > process.env.OTPExpirationTime) throw new Error('OTP has expired')

            User.update({ is_email_verified: true }, {
                where: {
                    email: email
                }
            })
            Otp.destroy({
                where: {
                    otp: _otp,
                    email: email
                }
            })
            res.status(200).send({
                status:true,
                message:`Successful.`
            })
        })       
        .catch((err)=>{
            console.log('here2:',err)
            throw new Error(err.message)
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

const updatepasswordforFP = async (req,res)=>{

    const {newpassword,email}= req.body

    User.findAll({
        where: {
            email:email
        }
    })

    .then((data)=>{
        if (data.length==0) {
            throw new Error(`email doesn't exist`)
        }
        return password_hash(newpassword)
    })
    .then(([hash,salt])=>{

        User.update({
            password_hash: hash,
            password_salt:salt
        }, { where: { email: email } })

        res.status(200).json({
            status:true,
            message:'password has been sucessfuly updated'
        })

    })
}



module.exports = {forgetpassword,verifyFPotp,updatepasswordforFP}


