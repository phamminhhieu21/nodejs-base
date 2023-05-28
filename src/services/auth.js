import db from "../models";

export const register = () => {
  new Promise((resolve, reject) =>{
    try{
      //
      resolve('register');
    }
    catch(err){
      reject(err);
    }
  })
}