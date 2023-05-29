import Joi from "joi";


export const email = Joi.string().email().pattern(new RegExp('gmail.com$')).required() // email validation
export const password = Joi.string().min(8).required() // password validation