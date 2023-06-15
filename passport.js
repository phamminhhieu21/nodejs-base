const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

    passport.use(new GoogleStrategy({ // GoogleStrategy is a class that has a constructor that takes two arguments: options and verify callback function (verify callback function is the function that will be called when the user is authenticated)
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback'
    },
    async function (accessToken, refreshToken, profile, done) {
        // if user login success then add profile to database and return the profile to the client
        console.log(profile);
        return done(null, profile); // done is a function that is called when the user is authenticated (it takes two arguments: error and user) (if there is no error, then the first argument is null)
    }))
