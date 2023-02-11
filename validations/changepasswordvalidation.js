const Joi = require('joi');


const changepasswordValidation = (data) => {
    const schema = Joi.object({
        currentpassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        newpassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirmpassword: Joi.ref('newpassword'),
    })

    return schema.validate(data)

}



module.exports = {changepasswordValidation}