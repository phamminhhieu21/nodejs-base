import db from '../models'
import {comparePassword, hashPassword, generateTemporaryPassword} from '../utils/password'
import jwt from 'jsonwebtoken'
import {forgotPasswordHtml, registerMailHtml} from "../utils/TemplateMail/authTemplateMail";
import {urlPaths} from "../constants/urlPaths";
const {v4: uuidv4} = require('uuid')
import sendMail from '../utils/sendMail'
import {generateAccessToken, generateToken, verifyToken} from '../utils/jwt'

export const register = ({email, password, name, gender, phone_number, date_of_birth}) =>
    new Promise(async (resolve, reject) => {
        try {
            // Check if email is already registered
            const resp = await db.User.findOrCreate( // findOrCreate will return array [object, boolean]
                {
                    where: {email},
                    defaults: {
                        email,
                        password: hashPassword(password),
                        name,
                        phone_number,
                        gender,
                        date_of_birth
                    }
                }
            )
            const accessToken = resp[1] ?
                jwt.sign({id: resp[0].id, email: resp[0].email, role_code: resp[0].role_code, name: resp[0].name},
                    process.env.JWT_SECRET, {expiresIn: '1h'})
                : null // if user is not exist, create access token
            const refreshToken = resp[1] ?
                jwt.sign({id: resp[0].id},
                    process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
                : null // if user is not exist, create refresh token
            resolve({
                code: resp[1] ? 0 : 1,
                message: resp[1] ? `Register success, ${resp[0].name} can login now` : 'Email already registered',
                access_token: accessToken ? `${accessToken}` : null,
                email: resp[0].email
                // refresh_token : refreshToken ? `${refreshToken}` : null
            })
            if (refreshToken) { // if refresh token is exist, update refresh token in db
                await db.User.update({
                    refresh_token: refreshToken
                }, {
                    where: {id: resp[0].id}
                })
            }
        } catch (err) {
            reject(err)
        }
    })

// register account with send mail confirm
export const registerConfirmMailService = (body) => new Promise(async (resolve, reject) => {
    try {
        const resp = await db.User.findOrCreate({
            where: {email: body.email},
            defaults: {
                ...body,
                password: hashPassword(body.password)
            }
        })
        const token = resp[1] && generateToken({
            email: resp[0].email
        }, '15m')
        const html = registerMailHtml(token)
        resp[1] && await sendMail({email: body.email, html, subject: 'Please complete register with HieuPM'})
        resolve({
            code: resp[1] ? 0 : 1,
            message: resp[1] ? 'Please check your email to confirm your account' : 'Email already registered'
        })
    } catch (e) {
        reject(e)
    }
})
export const verifyRegisterMailService = (token) => new Promise(async (resolve, reject) => {
    try {
        const {email} = verifyToken(token, process.env.JWT_SECRET)
        const resp = await db.User.findOne({where: {email}})
        if (resp) {
            await db.User.update({
                is_active: true
            }, {
                where: {id: resp.id}
            })
            resolve({
                code: 0,
                message: 'Register success, you can login now'
            })
        } else {
            resolve({
                code: 1,
                message: 'Email not exist'
            })
        }
    } catch (err) {
        reject(err)
    }
})
export const login = (email, password) =>
    new Promise(async (resolve, reject) => {
        try {
            const resp = await db.User.findOne(
                {
                    where: {email, is_active: true},
                    raw: true // return plain object instead of sequelize object
                }
            )
            // check if password is match with passwordReset in db or not
            if (resp?.passwordReset) {
                const isMatchPasswordReset = comparePassword(password, resp.passwordReset)
                if (isMatchPasswordReset) {
                    await db.User.update({
                        password: resp.passwordReset,
                        passwordReset: null,
                    }, {
                        where: {id: resp.id}
                    })
                }
            }
            if (resp && !resp?.passwordReset) await db.User.update({
                typeLogin: 'normal'
            }, {
                where: {id: resp.id}
            })
            const isCheckedPassword = resp ? comparePassword(password, resp.password) : false // compare password with hash password in db
            const accessToken = isCheckedPassword ?
                generateAccessToken(
                    {id: resp.id, email: resp.email, role_code: resp.role_code, name: resp.name}, '1h'
                )
                : null

            const refreshToken = isCheckedPassword ?
                jwt.sign({id: resp.id},
                    process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
                : null

            resolve({
                code: accessToken ? 0 : 1,
                message: accessToken ? `Welcome ${resp?.name}` : resp ? 'Wrong password' : 'Email not registered or not activated',
                data: {
                    id: resp?.id,
                    email: resp?.email,
                    name: resp?.name,
                    role_code: resp?.role_code,
                    avatar: resp?.avatar
                },
                typeLogin: resp?.email ? 'normal' : null,
                access_token: accessToken ? `${accessToken}` : null, // add Bearer to token for authorization header in request
                refresh_token: refreshToken ? `${refreshToken}` : null // refresh token is used to get new access token
            })

            if (refreshToken) { // if refresh token is exist, update refresh token in db
                await db.User.update({
                    refresh_token: refreshToken
                }, {
                    where: {id: resp.id}
                })
            }
        } catch (err) {
            reject(err)
        }
    })

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: {refresh_token}
        })
        if (response) {
            jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err) => {
                if (err) {
                    resolve({
                        err: 1,
                        mes: 'Refresh token expired. Require login'
                    })
                } else {
                    const accessToken = jwt.sign({
                        id: response.id,
                        email: response.email,
                        role_code: response.role_code
                    }, process.env.JWT_SECRET, {expiresIn: '1d'})
                    resolve({
                        err: accessToken ? 0 : 1,
                        mes: accessToken ? 'OK' : 'Fail to generate new access token. Let try more time',
                        'access_token': accessToken ? `${accessToken}` : accessToken,
                        'refresh_token': refresh_token
                    })
                }
            })
        } else {
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
            where: {idGoogle, tokenLogin},
            raw: true
        })
        if (response) await db.User.update({
                is_active: true
            }
            , {where: {id: response.id}}
        )
        const token = response && jwt.sign({
            id: response.id,
            email: response.email,
            role_code: response.role_code
        }, process.env.JWT_SECRET, {expiresIn: '1d'})
        if (response) {
            resolve({
                code: token ? 0 : 1,
                message: token ? `Welcome ${response.name}` : 'User not found or fail to login !',
                data: {
                    id: response.id,
                    email: response.email,
                    name: response.name,
                    role_code: response.role_code,
                    avatar: response.avatar
                },
                access_token: token ? `${token}` : null,
                typeLogin: response.typeLogin
            })
            await db.User.update({
                tokenLogin: newTokenLogin
            }, {
                where: {idGoogle}
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const forgotPassword = (email) => new Promise(async (resolve, reject) => {
    try {
        const resp = await db.User.findOne({where: {email}})
        const token = resp && generateToken(
            {id: resp.id, email: resp.email, role_code: resp.role_code}, '5m'
        )
        const passwordTemp = resp && await generateTemporaryPassword(8)
        if (resp && token) {
            await db.User.update({
                passwordReset: passwordTemp,
                tokenResetPassword: token,
                isForgotPassword: true
            }, {
                where: {id: resp.id}
            })

            const html = forgotPasswordHtml(passwordTemp, token)

            await sendMail({email, html, subject: 'Reset password from NodeStore App'})
            resolve({
                code: 0,
                message: 'Please check your email to reset password'
            })
        } else {
            resolve({
                code: 1,
                message: 'Email not exist'
            })
        }
    } catch (e) {
        reject(e)
    }
})

export const resetPassword = (token, password) => new Promise(async (resolve, reject) => {
    try {
        let checkToken = false; // check token is expired or not ? default is false (expired)
        const resp = await db.User.findOne({where: {tokenResetPassword: token}})

        if (resp) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => { // verify token is expired or not ?
                if (err) {
                    resolve({
                        code: 1,
                        message: 'Token expired. Require reset password again'
                    })
                } else {
                    checkToken = true; // if token is not expired, set checkToken = true
                }
            })
        }else{
            resolve({
                code: 1,
                message: 'Token not found'
            })
        }
        if (checkToken) { // if token is not expired, reset password and set tokenResetPassword = null in db User
            await db.User.update({
                password: hashPassword(password),
                tokenResetPassword: null,
                isForgotPassword: false,
                passwordReset: null
            }, {
                where: {tokenResetPassword: token}
            })
            resolve({
                code: 0,
                message: 'Reset password success'
            })
        }
    } catch (e) {
        reject(e)
    }
})
