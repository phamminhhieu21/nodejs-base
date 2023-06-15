const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import db from './src/models';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

    passport.use(new GoogleStrategy({ // GoogleStrategy is a class that has a constructor that takes two arguments: options and verify callback function (verify callback function is the function that will be called when the user is authenticated)
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback'
      },
    async function (accessToken, refreshToken, profile, done) {
        // if user login success then add profile to database and return the profile to the client
        console.log('profile',profile);
        const tokenLogin = uuidv4();
        profile.tokenLogin = tokenLogin;
        try{
          if(profile?.id){
            let resp = await db.User.findOrCreate({
              where: {
                id : profile.id
              },
              defaults: {
                id: profile.id,
                name: profile.displayName,
                typeLogin : profile.provider,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
                tokenLogin: tokenLogin
              }
            })
            if(!resp[1]){ //* if user already exists in database then update data of user
              await db.User.update({
                tokenLogin
              },{
                where: {
                  id : profile.id
                }
              })
            }
          }
        }catch(err){
            console.log(err);
        }
        return done(null, profile); // done is a function that is called when the user is authenticated (it takes two arguments: error and user) (if there is no error, then the first argument is null)
    }))
