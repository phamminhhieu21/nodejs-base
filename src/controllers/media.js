import * as services from "../services"
import { badRequest, internalServerError} from '../middlewares/handleErrors'
import Joi from 'joi';
const cloudinary = require('cloudinary').v2

export const getPhotos = async (req, res) => {
  try {
      // const { error } = Joi.object({ id }).validate(req.params)
      // if (error) return badRequest(error.details[0].message, res)
      const response = await services.getPhotos(req.query.userId)
      return res.status(200).json(response)
  } catch (error) {
      console.log(error)
      return internalServerError(res)
  }
}
export const uploadPhoto = async (req, res) => {
  try {
      const fileData = req.file
      // const { error } = Joi.object({ image }).validate({image: fileData?.path})
      // if (error){
      //   if (fileData) cloudinary.uploader.destroy(fileData.filename)
      //   return badRequest(error.details[0].message, res)
      // }
      const response = await services.uploadPhoto(req.body.userId, fileData)
      return res.status(200).json(response)
  } catch (error) {
      return internalServerError(res)
  }
}


export const deletePhoto = async (req, res) => {
  // try {
  //     const { error } = Joi.object({ ids, filename }).validate(req.query)
  //     const notValidFilename = req.query.filename.some(e => e == '' || e == null || e == undefined)
  //     if (error || notValidFilename) {
  //       if(notValidFilename) return badRequest('filename is not empty', res)
  //       return badRequest(error.details[0].message, res)
  //   }
  //     const response = await services.deleteBook(req.query.ids, req.query.filename)
  //     return res.status(200).json(response)
  // } catch (error) {
  //     return internalServerError(res)
  // }
}

