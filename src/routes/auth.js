import express from 'express';
import passport from 'passport';
import * as controller from '../controllers'
require('dotenv').config();
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshTokenController);

//* google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session : false })); // scope: ['profile', 'email'] is the default value for the scope parameter (optional)
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        if (err) {
            return next(err);
        }
        req.user = profile;
        next();
    })(req, res, next); // this is a middleware that will be called when the user is authenticated
},(req, res) => { // req.user is the user profile that is returned from the verify callback function in passport.js
    res.redirect(`${process.env.URL_CLIENT}/login-success/profile/${req.user.id}}`);
});
router.post('verify-profile-google', controller.verifyProfileGoogle);

module.exports = router;