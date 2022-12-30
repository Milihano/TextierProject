require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize")
const {registerValidation} = require('../validations/joiregistervalidation')
const {generateemailotp,password_hash} = require('../utils/emailOtp')




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
        const otp = generateemailotp()
        

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
        









    } catch (e) {
        res.status(400).json({
            status:false,
            message:e.message
        })
    }
    

    


}


module.exports = {register}

    





