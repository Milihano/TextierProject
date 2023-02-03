const {User} = require('../models')
const {updateValidation} = require('../validations/update')
const jwt = require('jsonwebtoken')

//Giving Error Of Userdata is not allowed

const Updatecustomer = async (req,res)=>{

    const { customer_id } = req.body.userData    
    const{error,value }= updateValidation(req.body)

    if (error != undefined) {
        res.status(400).json({
        status:false,
        message: error.details[0].message
    })}else{
         //from the authorization middleware

        // console.log('Here 1',customer_id)

        const { fullname, username, email, gender, phone, country, dob } = req.body
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



    }  
   




}



module.exports = {Updatecustomer}