require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize")
const {registerValidation} = require('../validations/joiregistervalidation')
const {generateemailotp,password_hash} = require('../utils/emailOtp')
const {sendEmail} = require('../services/emailotp');
const otp = require('../models/otp');




const register = async (req,res) => {


    const {error,value} = registerValidation(req.body)

    if (error != undefined) {
      res.status(400).json({
        status:false,
        message: error.details[0].message
    })   
    }
        const {fullname,username,password,email} = req.body
        const customer_id = uuidv4();
        const _otp = generateemailotp()
        

    try {
        await User.findAll({
            where: {
                [Op.or]: [
                    {username: username},
                    {email:email}
                ]
            }
        })
        .then((data)=>{
            if (data.length != 0) {
                throw new Error `Email or Username already Exist`
            }
            return password_hash(password)
        })
        .then(([hash,salt])=>{
            return await User.create({
                customer_id: customer_id,
                fullname: fullname, 
                username: username,
                password_hash: hash,
                password_salt: salt,
                email:email
            });
        })
        .then((insertIntoOtpTable) => {
    
            return otp.create({
                
                otp: _otp,
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
            res.status(400).json({
                status:false,
                message:err.message
            })
        })
    } catch (e) {
        res.status(400).json({
            status:false,
            message:e.message
        })
    }
}
const verifyemailOtp = ((req,res)=>{

    const {email,_otp}=req.params
    try {
        otp.findAll({
            where: {
                [Op.and]: [
                    {email: email},
                    {otp:_otp}
                ]
            }
        })
        .then((data)=>{
            if (data.length === 0) {
                res.status(400).json({
                    status:false,
                    message:`Incorrect Otp`
                })
            }
        })
        




    } catch (err) {
        res.status(400).json({
            status: false,
            message: err.message
        })
        
    }
        
})


module.exports = {register,verifyemailOtp}

    





