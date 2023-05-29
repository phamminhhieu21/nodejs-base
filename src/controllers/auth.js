import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handleErrors";
import { email, password } from "../utils/helpers/joi_schema";
import joi from 'joi';
export const register = async (req, res) => {
  try{
    const {error} = joi.object({
      email,
      password
    }).validate(req.body); // validate email and password with joi schema from helpers folder (joi_schema.js)
    if(error) return badRequest(error.details[0]?.message, res);
  
    const response = await services.register(req.body.email, req.body.password);
    console.log('register controller',response)
    return res.status(200).json(response);
  }
  catch(err){
    return internalServerError(res);
  }
}
export const login = async (req, res) => {
  try{
    const {error} = joi.object({
      email,
      password
    }).validate(req.body); // validate email and password with joi schema from helpers folder (joi_schema.js)
    if(error) return badRequest(error.details[0]?.message, res);
    const response = await services.login(req.body.email, req.body.password);
    console.log('login controller',response)
    return res.status(200).json(response);
  }
  catch(err){
    return internalServerError(res);
  }
}