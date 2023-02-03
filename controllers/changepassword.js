const {User} = require('../models')
const {updateValidation} = require('../validations/update')
const jwt = require('jsonwebtoken')

//Haven't Worked On It Yet

const changepassword = async (req,res)=>{

    const{error,value }= updateValidation(req.body)

    if (error != undefined) {
        res.status(400).json({
        status:false,
        message: error.details[0].message
    })}else{

        const { customer_id } = req.body.UserData //from the authorization middleware

        const { password } = req.body
        
        try {
            User.findAll({
                where: {
                    [Op.or]: [
                        {password: password}
                    ]
                }
            })
            .then((data)=>{
                if (data.length > 0) {
                    throw new Error(`Password already Exist`)
                }
                return password_hash(password)
            })
            await User.update({
                password:password,
            }, { where: { customer_id: customer_id } })




        } catch (err) {
            res.status(400).json({
                status:false,
                message:err.message
            })
        }    



    }  
   




}



module.exports = {changepassword}