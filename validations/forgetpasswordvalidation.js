const Joi = require('joi');


const forgetpasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    })

    return schema.validate(data)

}



module.exports = {forgetpasswordValidation}