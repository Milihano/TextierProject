const bcrypt = require('bcrypt')
const { Op } = require("sequelize")
const {User} = require('../models')
const {generateemailotp,password_hash} = require('../utils/emailOtp')





const Login =( async (req,res)=>{

    const {username,password}= req.body

    try {
        const result = await User.findAll(
            { where: { username: username } }
        )

        if (result.length === 0) throw new Error("Username or password is incorrect")

        const passwordHashFromDB = User[0].dataValues.password_hash
        // console.log("pw:",passwordHashFromDB)
        const passwordCompare =  await bcrypt.compare(password, passwordHashFromDB)
      
        if (passwordCompare === false) throw new Error("Username or password is incorrect")

        res.status(200).json({
            status:true,
            message:`Welcome back`
        })

    
    } catch (error) {
        res.status(400).json({
            status:false,
            message:error.message
        })
    }
})


module.exports = {Login}