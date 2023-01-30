require('dotenv').config()
const bcrypt = require('bcrypt')
const { Op } = require("sequelize")
const {User} = require('../models')
const jwt = require('jsonwebtoken')






const Login = async (req,res)=>{

    const {username,password}= req.body

    try {
        const result = await User.findAll(
            { where: { username: username } }
        )

        if (result.length === 0) throw new Error("Username or password is incorrect")

        //This is to check where you are going to pick the hash password from => console.log(result)

        const hashedpassword = result[0].dataValues.password_hash

        //console.log(hashedpassword)

        const compare = await bcrypt.compare(password, hashedpassword)
        if (compare === false) {
            throw new Error("Username or password is incorrect")
        }

        const token = jwt.sign(
            {
                customer_id: result[0].dataValues.customer_id,
                name: result[0].dataValues.name,
                email:  result[0].dataValues.email,
                username: result[0].dataValues.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        console.log(token)

        res.setHeader('token', token)

        res.status(200).json({
            status: true,                               
            token: token,
            message: "Sucessfully login"
        })
    } catch (err) {
        res.status(400).json({
            status:false,
            message:err.message
        })
    }
}


module.exports = {Login}