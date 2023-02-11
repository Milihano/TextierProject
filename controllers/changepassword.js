const {User} = require('../models')
const {changepasswordValidation} = require('../validations/changepasswordvalidation')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//Haven't Worked On It Yet

const changepassword = async (req,res)=>{

    const{error,value }= changepasswordValidation(req.body)

    if (error != undefined) {
        res.status(400).json({
        status:false,
        message: error.details[0].message
    })}else{

        const { customer_id } = req.params.userData //from the authorization middleware

        const { currentpassword,newpassword,confirmpassword } = req.body
        
        try {
            

            const hashedpassword = result[0].dataValues.password_hash
            console.log('Here for result:', hashedpassword)

            const compare = await bcrypt.compare(currentpassword, hashedpassword)
            if (compare === true) {
                const compare = await bcrypt.compare(newpassword, hashedpassword)
                if (compare === true) {
                    throw new Error("Password can't be the same as old one")
                }else{
                    password_hash(newpassword)
                }
            }
            await User.update({
                password_hash:hash,
                password_salt:salt
            }, { where: { customer_id: customer_id } })

            .catch((err)=>{
                console.log('here for catch:',err)
                throw new Error(err.message)
            })
        } catch (err) {
            res.status(400).json({
                status:false,
                message:err.message
            })
        }    



    }  
   




}



module.exports = {changepassword}