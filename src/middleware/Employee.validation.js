

const Joi = require('@hapi/joi');

// createEmployee Validation
const createEmployeeValidation = (data) => {
    const schema = Joi.object().keys({
        username: Joi.string().min(1).required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        supper_admin: Joi.number().required(),
        ban_state: Joi.number().required(),
        tel: Joi.string().min(6).required(),
        name: Joi.string().min(1).required(),
        birth_date: Joi.string().min(8).required(),
        gender: Joi.string().min(3).required(),
        surname: Joi.string().min(1).required()
    });
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object().keys({
        username: Joi.string().min(1).required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data)
}


module.exports =
{
    createEmployeeValidation,
    loginValidation
}
