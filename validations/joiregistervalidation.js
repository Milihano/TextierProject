const Joi = require('joi');


const registerValidation = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().alphanum().min(3).max(30).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password').required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    })

    return schema.validate(data)

}



module.exports = {registerValidation}