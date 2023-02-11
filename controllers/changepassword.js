const {User} = require('../models')
const {changepasswordValidation} = require('../validations/changepasswordvalidation')
const jwt = require('jsonwebtoken')
const{password_hash} = require('../utils/otp&hashing')
const bcrypt = require('bcrypt')

//Haven't Worked On It Yet

const changepassword = async (req,res)=>{

    const{error,value }= changepasswordValidation(req.body)

    if (error != undefined) {
        res.status(400).json({
        status:false,
        message: error.details[0].message
    })}
    const { customer_id } = req.params.userData //from the authorization middleware
    //console.log("here for email",email)
    const { currentpassword,newpassword,confirmpassword } = req.body
    
    try {
        const result = await User.findAll(
            { where: { customer_id: customer_id } }
        )
       console.log("here",result)
        const hashedpassword = result[0].dataValues.password_hash
        console.log('Here for result:', hashedpassword)

        const compare = await bcrypt.compare(currentpassword, hashedpassword)
        if (compare === false) {
            throw new Error("Password is incorrect")
        }
        const compare1 = await bcrypt.compare(newpassword, hashedpassword)
        if (compare1 === true) {
            throw new Error("Password can't be the same as old one")
        }                       
        const [hash,salt] = await password_hash(newpassword) 

        await User.update({
            password_hash:hash,
            password_salt:salt
        }, { where: { customer_id: customer_id } })

        res.status(200).json({
            status:true,
            message:`Password Successfully Change`
        })

    } catch (err) {
        console.log("Here for err:",err)
        res.status(400).json({
            status:false,
            message:err.message
        })
    }    
}



module.exports = {changepassword}