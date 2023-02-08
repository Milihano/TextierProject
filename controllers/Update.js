const {User} = require('../models')
const {updateValidation} = require('../validations/update')
const jwt = require('jsonwebtoken')

//Giving Error Of Userdata is not allowed
//Fixed.....

const Updatecustomer = async (req,res)=>{

    console.log('Here for token objects:',req.params.userData)

    const{error,value }= updateValidation(req.body)

    if (error != undefined) {
        res.status(400).json({
        status:false,
        message: error.details[0].message
    })}else{        
        const { fullname, username, email, gender, phone, country, dob } = req.body
        const { customer_id } = req.params.userData
        try {
            await User.update({
                fullname: fullname,
                username:username,
                gender: gender,
                dob: dob,
                email:email,
                phone:phone,
                country: country,
            }, { where: { customer_id: customer_id } })
        } catch (err) {
            res.status(400).json({
                status:false,
                message:err.message
            })
        }
        res.status(400).json({
            status:true,
            message:"Profile has been successfully updated"
        })   
    }  
}



module.exports = {Updatecustomer}