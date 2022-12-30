const bcrypt = require('bcrypt')
const saltRounds = 10



const generateemailotp = () => {

    const otp = Math.floor(1000 + Math.random() * 9000)

    return otp
}


const  password_hash = (password) => {

    return new Promise ((resolve, reject)  => {
       
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash)  => {
                if (err) {
                    reject(err)
                }
                resolve([hash, salt])
            })
        })
           
    })
}




module.exports = {generateemailotp,password_hash}