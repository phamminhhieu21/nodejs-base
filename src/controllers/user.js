import * as services from "../services"
import { internalServerError} from "../middlewares/handleErrors"
import { id} from "../utils/helpers/joi_schema";
const cloudinary = require('cloudinary').v2
import joi from 'joi';

export const getCurrent = async (req, res) => {
    try {
        const { idUser } = req.params // get user id from req object (added by verifyToken middleware)
        const response = await services.getOne(idUser)
        return res.status(200).json(response)

    } catch (error) {
        return internalServerError(res);
    }
}
export const updateProfileUser = async (req, res) => {
    try {
        const fileData = req.file
        const { id } = req.body
        const { error } = joi.object({ id }).validate({ id: id })
        if (error) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename)
            return badRequest(error.details[0].message, res)
        }
        const response = await services.updateProfileUser(req.body, fileData)
        return res.status(200).json(response)

    } catch (error) {
        return internalServerError(res);
    }
}