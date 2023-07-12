import * as services from '../services'
import {internalServerError, badRequest} from '../middlewares/handleErrorMiddleware'
import {
    email,
    password,
    refreshToken,
    name,
    phone_number,
    gender,
    date_of_birth,
    token,
    oldPassword,
    newPassword,
    id
} from '../utils/helpers/joi_schema'
import joi from 'joi'
import {urlPaths} from "../constants/urlPaths";

export const register = async (req, res) => {
    try {
        const {error} = joi.object({
            email,
            password,
            name,
            phone_number,
            gender,
            date_of_birth
        }).validate(req.body) // validate email and password with joi schema from helpers folder (joi_schema.js)
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.register(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}
export const registerMailController = async (req, res) => {
    try {
        const {error} = joi.object({
            email,
            password,
            name,
            phone_number,
            gender,
            date_of_birth
        }).validate(req.body) // validate email and password with joi schema from helpers folder (joi_schema.js)
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.registerConfirmMailService(req.body)
        if (response.code !== 0) return res.status(200).json(response)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}
export const verifyRegisterMailController = async (req, res) => {
    try {
        const {token} = req.params
        if (!token) return res.redirect(`${urlPaths.client.REGISTER_MAIL_FAILED}`)
        const response = await services.verifyRegisterMailService(token)
        if (response.code !== 0) return res.redirect(`${urlPaths.client.REGISTER_MAIL_FAILED}`)
        return res.redirect(`${urlPaths.client.REGISTER_MAIL_SUCCESSFUL}`)
    } catch (err) {
        return internalServerError(res)
    }
}
export const login = async (req, res) => {
    try {
        const {error} = joi.object({
            email,
            password
        }).validate(req.body) // validate email and password with joi schema from helpers folder (joi_schema.js)
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.login(req.body.email, req.body.password)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        const {token : rushToken} = req.params
        const {error} = joi.object({
            refreshToken
        }).validate({
            refreshToken: rushToken
        }) // validate email and password with joi schema from helpers folder (joi_schema.js)
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.refreshToken(rushToken)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}
export const verifyLoginProfile = async (req, res) => {
    try {
        const {idGoogle, tokenLogin} = req?.body
        if (!idGoogle || !tokenLogin) return badRequest('Missing input', res)
        const response = await services.verifyLoginProfile(idGoogle, tokenLogin)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}

export const changePassword = async (req, res) => {
    try {
        const {id ,newPassword, oldPassword } = req.body
        const {error} = joi.object({
            id,
            newPassword,
            oldPassword
        }).validate(req.body)
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.changePassword(id, newPassword, oldPassword)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body
        const {error} = joi.object({
            email
        }).validate({
            email
        })
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.forgotPassword(email)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token, newPassword} = req.body
        const {error} = joi.object({
            token,
            password
        }).validate({
            token,
            password: newPassword
        })
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.resetPassword(token, newPassword)
        return res.status(200).json(response)
    } catch (err) {
        return internalServerError(res)
    }
}