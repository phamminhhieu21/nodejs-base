import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handleErrors";
import { email, password, refreshToken, name } from "../utils/helpers/joi_schema";
import joi from 'joi';
export const register = async (req, res) => {
  try{
    const {error} = joi.object({
      email,
      password,
      name
    }).validate(req.body); // validate email and password with joi schema from helpers folder (joi_schema.js)
    if(error) return badRequest(error.details[0]?.message, res);
    const response = await services.register(req.body.email, req.body.password, req.body.name);
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
    return res.status(200).json(response);
  }
  catch(err){
    return internalServerError(res);
  }
}

export const refreshTokenController = async (req, res) => {
  try{
    console.log('refresh token controller', req.body.refresh_token)
    const {error} = joi.object({
      refreshToken
    }).validate({
      refreshToken : req.body.refresh_token
    }); // validate email and password with joi schema from helpers folder (joi_schema.js)
    if(error) return badRequest(error.details[0]?.message, res);
    const response = await services.refreshToken(req.body.refresh_token);
    return res.status(200).json(response);
  }
  catch(err){
    return internalServerError(res);
  }
}