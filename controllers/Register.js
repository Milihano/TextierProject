require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize")
const {registerValidation} = require('../validations/joiregistervalidation')
const {generateemailotp,password_hash} = require('../utils/emailOtp')
const {sendEmail} = require('../services/emailotp');
const {Otp} = require('../models');
const {User} = require('../models')





const register = async (req,res) => {
    const _otp = generateemailotp();


    const {error,value} = registerValidation(req.body)

    if (error != undefined) {
      res.status(400).json({
        status:false,
        message: error.details[0].message
    })   
    }
        const {fullname,username,password,repeat_password,email,gender,dob} = req.body

        const customer_id = uuidv4();
        
        

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
                dob:dob
            });
        })
        .then((insertIntoOtpTable) => {
    
            return Otp.create({
                
                Otp: _otp,
                email: email,
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
        
        .then((data)=>{
            console.log('this:', data)
            if (data.length === 0) {
                throw new Error(`Invalid Otp...`)
            }
            res.status(200).send({
                status:true,
                message:`Successfully Created.`
            })
            return User.update({ is_email_verified: true }, {
                where: {email: email}
            })
        })
        .then((data)=>{
            Otp.destroy({
                where: {
                    otp: _otp,
                    email: email
                }
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

module.exports = {register,verifyemailOtp}

    





