require('dotenv').config()
const jwt = require('jsonwebtoken')


const authorization = async(req, res, next) => {

    const token = req.headers.authorization

    console.log("token: ", token)

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        })
    }

    try {
        const tokenSplit = token.split(' ') // Bearer hjglghlhhkh;j4567890jjkhg78654g
        const decoded = jwt.verify(tokenSplit[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) throw new Error(err.message)
    
            req.body.userData = decoded //req.userData.customer_id is the payload of the token
            next()
        }) //err, decoded
        
    } catch (e) {
        console.log("errr: ", e)
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        })
    }


}


module.exports = { authorization }