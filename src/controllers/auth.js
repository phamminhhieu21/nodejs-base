import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handleErrors";
import { email, password, refreshToken, name, phone_number, gender, date_of_birth } from "../utils/helpers/joi_schema";
import joi from 'joi';
export const register = async (req, res) => {
  try{
    const {error} = joi.object({
      email,
      password,
      name,
      phone_number,
      gender,
      date_of_birth
    }).validate(req.body); // validate email and password with joi schema from helpers folder (joi_schema.js)
    if(error) return badRequest(error.details[0]?.message, res);
    const response = await services.register(req.body);
    return res.status(200).json(response);
  }
  catch(err){
    return internalServerError(res);
  }
}
export const registerMailController = async (req, res) => {
  try{
    const { email } = req.body;
    const {error} = joi.object({
      email,
      password,
      name,
      phone_number,
      gender,
      date_of_birth
    }).validate(req.body); // validate email and password with joi schema from helpers folder (joi_schema.js)
    if(error) return badRequest(error.details[0]?.message, res);
    const response = await services.registerConfirmMailService(email);
    if(response.code !== 0) return res.status(200).json(response);
    res.cookie('dataRegister', {...req.body, token : response.token }, { httpOnly: true, maxAge: 15 * 60 * 1000 }); // set data register to cookie
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
export const verifyLoginProfile = async (req, res) => {
    try{
      const {idGoogle , tokenLogin} = req?.body;
      if(!idGoogle || !tokenLogin) return badRequest('Missing input', res);
      const response = await services.verifyLoginProfile(idGoogle, tokenLogin);
      return res.status(200).json(response);
    }
    catch(err){
        return internalServerError(res);
    }
}