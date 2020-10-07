import Joi from 'joi'

const authSchema = Joi.object({
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(8).message('Password length must be atleast 8').pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).message('Password must contain atleast one upper case letter, one lower case letter, one number and one special character').required(),
    confirmPassword: Joi.ref('password'),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required()
})

export { authSchema }
