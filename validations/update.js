

const Joi = require('joi')

const updateValidation = (data) => {

  const schema = Joi.object({
    fullname : Joi.string().required(),
    gender:Joi.string().required(),
    username:Joi.string().required(),
    dob: Joi.string().required(),
    phone: Joi.string().min(2).required(),
    email:Joi.string().required(),
    country: Joi.string().required(),
  })

    return  schema.validate(data);

}





module.exports = { updateValidation }