import express from 'express';
import passport from 'passport';
import * as controller from '../controllers'

require('dotenv').config();
const router = express.Router();
import {urlPaths} from "../constants/urlPaths";

// register account
router.post('/register', controller.registerMailController);
// router.post('/register/confirm-mail/:token', controller.verifyRegisterMailController);
// router.post('/register', controller.register);

// login
router.post('/login', controller.login);
// forgot password
router.post('/forgot-password', controller.forgotPassword);
// reset password
router.post('/reset-password', controller.resetPassword);
// change password
router.post('/change-password', controller.changePassword);
// refresh token
router.post('/refresh-token/:token', controller.refreshTokenController);

//* google auth
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'], session: false})); // scope: ['profile', 'email'] is the default value for the scope parameter (optional)
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        if (err) {
            return next(err);
        }
        req.user = profile;
        next();
    })(req, res, next); // this is a middleware that will be called when the user is authenticated
}, (req, res) => { // req.user is the user profile that is returned from the verify callback function in passport.js
    res.redirect(`${urlPaths.client.LOGIN_SUCCESSFUL}/${req.user.id}/${req.user.tokenLogin}`);
});
router.post('/login-success/verify-profile', controller.verifyLoginProfile);

module.exports = router;