import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { v4: uuidv4 } = require('uuid');
import sendMail from '../utils/sendMail';
import asyncHandler from 'express-async-handler';
const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}
export const register = ({email, password, name, gender, phone_number, date_of_birth}) =>
  new Promise( async(resolve, reject) =>{
    try{
      // Check if email is already registered
      const resp = await db.User.findOrCreate( // findOrCreate will return array [object, boolean]
        {
          where: {email},
          defaults: {
            email,
            password : hashPassword(password),
            name,
            phone_number,
            gender,
            date_of_birth,
          }
        }
      )
      const accessToken =  resp[1] ? 
      jwt.sign({id : resp[0].id,email : resp[0].email, role_code : resp[0].role_code,name : resp[0].name},
      process.env.JWT_SECRET,{expiresIn : '1h'}) 
      : null; // if user is not exist, create access token 
      const refreshToken =  resp[1] ?
      jwt.sign({id : resp[0].id},
      process.env.JWT_REFRESH_SECRET,{expiresIn : '7d'})
      : null; // if user is not exist, create refresh token
      resolve({
        code : resp[1] ? 0 : 1,
        message : resp[1] ? `Register success, ${resp[0].name} can login now` : 'Email already registered',
        access_token : accessToken ? `${accessToken}` : null,
          email : resp[0].email
        // refresh_token : refreshToken ? `${refreshToken}` : null
      });
      if(refreshToken){ // if refresh token is exist, update refresh token in db 
        await db.User.update({
          refresh_token : refreshToken
        },{
          where : {id : resp[0].id},
        })
      }
    }
    catch(err){
      reject(err);
    }
  })

// register account with send mail confirm
export const registerConfirmMailService = (email) => new Promise(async(resolve, reject) => {
    try{
        const user = await db.User.findOne({ where: { email } });
        if (user) {
            resolve({
                code: 1,
                message: 'Email already registered'
            })
        }
        const token = uuidv4();
        const html = `<p>Please click into link below to finished progress register account, link will expired after 15 min from now</p> 
                             <a href="${process.env.URL_SERVER}/api/v1/auth/register/confirm-mail/${token}">Click here</a>`;
        const info = await sendMail({ email, html, subject : 'Please complete register with HieuPM' });
        resolve({
            code: 0,
            token : token,
            message: 'Please check your email to confirm your account',
            info
        })
    }catch (e) {
        reject(e);
    }
})
export const verifyRegisterMailService = (token, cookie) => new Promise(async(resolve, reject) => {
    try{
       const resp = await db.User.create({
            ...cookie.dataRegister
       })
        resolve({
            code: resp ? 0 : 1,
            message: resp ? 'Register success, please go login!' : 'Register faild',
            dataRegister : resp ? resp : null
        })
    }catch (e) {
        reject(e);
    }
})
  export const login = (email, password) => 
  new Promise( async(resolve, reject) =>{
    try{
      const resp = await db.User.findOne(
        {
          where: {email},
          raw : true // return plain object instead of sequelize object
        }
      )
        if(resp) await db.User.update({
          typeLogin : 'normal',
        },{
          where : {id : resp.id},
        })
      const isCheckedPassword = resp ? bcrypt.compareSync(password, resp.password) : false // compare password with hash password in db 
      const accesstoken =  isCheckedPassword ?
      jwt.sign({id : resp.id,email : resp.email, role_code : resp.role_code,name : resp.name},
      process.env.JWT_SECRET,{expiresIn : '1h'})
      : null;

      const refreshToken =  isCheckedPassword ?
      jwt.sign({id : resp.id},
      process.env.JWT_REFRESH_SECRET,{expiresIn : '7d'})
      : null;

      resolve({
        code : accesstoken ? 0 : 1,
        message : accesstoken ? `Welcome ${resp?.name}` : resp ? 'Wrong password' : 'Email not registered',
        data : {
          id : resp?.id,
          email : resp?.email,
          name : resp?.name,
          role_code : resp?.role_code,
          avatar : resp?.avatar
        },
        typeLogin : 'normal',
        access_token : accesstoken ? `${accesstoken}` : null, // add Bearer to token for authorization header in request
        refresh_token : refreshToken ? `${refreshToken}` : null // refresh token is used to get new access token
      });

      if(refreshToken){ // if refresh token is exist, update refresh token in db
        await db.User.update({
          refresh_token : refreshToken
        },{
          where : {id : resp.id},
        })
      }
    }
    catch(err){
      reject(err);
    }
  })

  export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        console.log('refresh token service', refresh_token)
        const response = await db.User.findOne({
            where: { refresh_token }
        })
        if (response) {
            jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err) => {
                if (err) {
                    resolve({
                        err: 1,
                        mes: 'Refresh token expired. Require login'
                    })
                }
                else {
                    const accessToken = jwt.sign({ id: response.id, email: response.email, role_code: response.role_code }, process.env.JWT_SECRET, { expiresIn: '1d' })
                    resolve({
                        err: accessToken ? 0 : 1,
                        mes: accessToken ? 'OK' : 'Fail to generate new access token. Let try more time',
                        'access_token': accessToken ? `${accessToken}` : accessToken,
                        'refresh_token': refresh_token
                    })
                }
            })
        }else{
            resolve({
                err: 1,
                mes: 'Refresh token not found'
            })
        }
    } catch (error) {
        reject(error)
    }
})
export const verifyLoginProfile = (idGoogle, tokenLogin) => new Promise(async (resolve, reject) => {
  try {
      const newTokenLogin = uuidv4()
      const response = await db.User.findOne({
          where: { idGoogle , tokenLogin },
          raw: true
      })
      const token = response && jwt.sign({ id: response.id, email: response.email, role_code: response.role_code }, process.env.JWT_SECRET, { expiresIn: '1d' })
      if (response) {
          resolve({
              code: token ? 0 : 1,
              message: token ? `Welcome ${response.name}` : 'User not found or fail to login !',
              data : {
                    id : response.id,
                    email : response.email,
                    name : response.name,
                    role_code : response.role_code,
                    avatar : response.avatar,
              },
              access_token: token ? `${token}` : null,
              typeLogin : response.typeLogin,
          })
          await db.User.update({
              tokenLogin: newTokenLogin
          }, {
              where: { idGoogle}
          })
      }
  } catch (error) {
      reject(error)
  }
})
