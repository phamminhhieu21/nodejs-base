import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}
export const register = (email, password) => 
  new Promise( async(resolve, reject) =>{
    try{
      // Check if email is already registered
      const resp = await db.User.findOrCreate(
        {
          where: {email},
          defaults: {
            email,
            password : hashPassword(password),
          }
        }
      )
      console.log('register service',resp)
      const token =  resp[1] ? 
      jwt.sign({id : resp[0].id,email : resp[0].email, role_code : resp[0].role_code,},
      process.env.JWT_SECRET,{expiresIn : '2d'}) 
      : null;
      resolve({
        code : resp[1] ? 0 : 1,
        message : resp[1] ? 'Register success' : 'Email already registered',
        // token : token
      });
    }
    catch(err){
      reject(err);
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
      const isCheckedPassword = resp ? bcrypt.compareSync(password, resp.password) : false // compare password with hash password in db 
      console.log('login service',resp)
      const token =  isCheckedPassword ?
      jwt.sign({id : resp.id,email : resp.email, role_code : resp.role_code,},
      process.env.JWT_SECRET,{expiresIn : '2d'})
      : null;

      resolve({
        code : token ? 0 : 1,
        message : token ? 'Login success' : resp ? 'Wrong password' : 'Email not registered',
        'access_token' : token ? `Bearer ${token}` : null // add Bearer to token for authorization header in request 
      });
    }
    catch(err){
      reject(err);
    }
  })
