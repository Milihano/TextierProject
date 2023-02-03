const {User} = require('../models/User')
const {Otp} = require('../models/Otp')
const {generateotp} = require('../utils/otp&hashing')
const {sendEmail}= require('../services/emailotp')
const {forgetpasswordValidation}= require('../validations/forgetpasswordvalidation')


//Giving Error "Cannot destructure property 'username' "

const forgetpassword = async (res,req)=>{

    const _otp = generateotp()

    const {error,value} = forgetpasswordValidation(req.body)

    if (error) {
        res.status(400).json({
            status:false,
            message: error.details[0].message
        })
    }
    
    const{username,email} = req.body

    User.findAll({
        where: {
            [Op.or]: [
                {username: username},
                {email:email}
            ]
        }
    })
    .then((data)=>{
        if (data.length==0) {
            res.status(400).json({
                status:false,
                message:`Username or Email Does Not Exist`
            })
        }
        

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
const verifyforgetotpandputnewpassword = async (req,res)=>{
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
        
        .then((data)=>{
            console.log('this:', data)
            if (data.length === 0) {
                throw new Error(`Invalid Otp...`)
            }
            res.status(200).send({
                status:true,
                message:`Successful.`
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
        .then( async ()=>{
            const {newpassword}= req.body
            await password_hash(newpassword)
            .then(([hash,salt])=>{
                User.update({
                    password_hash: hash,
                    password_salt:salt
                }, { where: { email: email } })
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



module.exports = {forgetpassword,verifyforgetotpandputnewpassword}