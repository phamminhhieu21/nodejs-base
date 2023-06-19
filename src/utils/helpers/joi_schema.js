import Joi from "joi";

// user
export const id = Joi.string().required()
export const email = Joi.string().pattern(new RegExp('gmail.com$')).required()
export const name = Joi.string().required()
export const password = Joi.string().min(6).required()
export const gender = Joi.string().required()
export const phone_number = Joi.string()
export const date_of_birth = Joi.date().required()
export const role_code = Joi.string().uppercase().required()
export const refresh_token = Joi.string().required()

// book
export const title = Joi.string().required()
export const price = Joi.number().required()
export const available = Joi.number().required()
export const category_code = Joi.string().uppercase().required()
export const image = Joi.string().required()
export const ids = Joi.array().required()
export const filename = Joi.array().required()
export const description = Joi.string().required()
export const refreshToken = Joi.string().required()