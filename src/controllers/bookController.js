import * as services from "../services"
import { badRequest, internalServerError} from '../middlewares/handleErrorMiddleware'
import { title, image, category_code, price, available, description, id , ids, filename } from "../helpers/joi_schema"
import Joi from 'joi';
const cloudinary = require('cloudinary').v2
export const getBooks = async (req, res) => {
  try {
      const response = await services.getBooks(req.query)
      return res.status(200).json(response)

  } catch (error) {
      return internalServerError(res)
  }
}

export const createBook = async (req, res) => {
  try {
      const fileData = req.file
      const {title, price, available, category_code  } = req.body
      const { error } = Joi.object({ title, image, category_code, price, available, description }).validate({ ...req.body, image: fileData?.path})
      if (error){
        if (fileData) cloudinary.uploader.destroy(fileData.filename)
        return badRequest(error.details[0].message, res)
      }
      const response = await services.createBook(req.body, fileData)
      return res.status(200).json(response)
  } catch (error) {
      return internalServerError(res)
  }
}
export const updateBook = async (req, res) => {
  try {
      const fileData = req.file
      const {id} = req.body
      const { error } = Joi.object({ id }).validate({ id : id})
      if (error) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename)
        return badRequest(error.details[0].message, res)
      }
      const response = await services.updateBook(req.body, fileData)
      return res.status(200).json(response)
  } catch (error) {
      return internalServerError(res)
  }
}

export const deleteBook = async (req, res) => {
  try {
      const { error } = Joi.object({ ids, filename }).validate(req.query)
      const notValidFilename = req.query.filename.some(e => e == '' || e == null || e == undefined)
      if (error || notValidFilename) {
        if(notValidFilename) return badRequest('filename is not empty', res)
        return badRequest(error.details[0].message, res)
    }
      const response = await services.deleteBook(req.query.ids, req.query.filename)
      return res.status(200).json(response)
  } catch (error) {
      return internalServerError(res)
  }
}

export const createCategory = async (req, res) => {
  try {
      const { code, value } = req.body
      if(!code || !value) return badRequest(res, 'Code or value is required')
      const response = await services.createBook(req.body)
      return res.status(200).json(response)

  } catch (error) {
      return internalServerError(res)
  }
}
export const getCategory = async (req, res) => {
  try {
      const response = await services.getCategory(req.body)
      return res.status(200).json(response)

  } catch (error) {
      return internalServerError(res)
  }
}