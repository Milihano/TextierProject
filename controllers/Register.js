require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize")
const {registerValidation} = require('../validations/joiregistervalidation')
const {generateemailotp} = require('../utils/emailOtp')



const register = (req,res) => {


    const {error,value} = registerValidation(req.body)

    if (error != undefined) {
      res.status(400).json({
        status:false,
        message: error.details[0].message
    })   
    }else {
        const {fullname,username,password,email} = req.body

        const customer_id = uuidv4();
        const otp = generateemailotp()
    }

    User.findAll({
        where: {
            [Op.or]: [
                {username: username},
                {email:email}
            ]
        }
    })

    


}


module.exports = {register}

    





