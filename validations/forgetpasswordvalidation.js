const Joi = require('joi');


const forgetpasswordValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    })

    return schema.validate(data)

}



module.exports = {forgetpasswordValidation}