

const Joi = require('joi')

const updateValidation = (data) => {

  const schema = Joi.object({
    name : Joi.string().required(),
    gender:Joi.string().required(),
    username:Joi.string().required(),
    dob: Joi.string().required(),
    email:Joi.string().required(),
    country: Joi.string().required(),
  })

    return  schema.validate(data);

}





module.exports = { updateValidation }