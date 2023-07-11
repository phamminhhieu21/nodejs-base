import db from "../models";
import {Op} from 'sequelize'
import {v4 as generateId} from 'uuid'

const cloudinary = require('cloudinary').v2
// READ
export const getBooks = ({page, limit, order, title, available, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = {raw: true, nest: true} // raw: true, nest: true is used to remove metadata from response
        const offset = (!page || +page <= 1) ? 0 : (+page - 1) // calculate offset from page number (default page = 1)
        const fLimit = +limit || +process.env.LIMIT
        queries.offset = offset * fLimit // offset is used to skip rows in table
        queries.limit = fLimit // limit is used to limit number of rows in table
        queries.order = order ? [order] : [['createdAt', 'DESC']] // order is used to sort data in ascending or descending order (default order = DESC)
        if (title) query.title = {[Op.substring]: title} // Op.substring is used to find substring in string
        if (available) query.available = {[Op.between]: available} // Op.between is used to find value between two values
        const response = await db.Book.findAndCountAll({ // findAndCountAll is used to get total count of rows in table
            where: query,
            ...queries,
            attributes: {
                exclude: ['category_code', 'description']
            },
            include: [
                {model: db.Category, attributes: {exclude: ['createdAt', 'updatedAt']}, as: 'categoryData'}
            ]
        })
        resolve({
            code: response ? 0 : 1,
            // mes: response ? 'Got' : 'Cannot found books',
            data: {
                total: response.count,
                limit: fLimit,
                page: +page || 1,
                pages : Math.ceil(response.count / fLimit),
                output: response.rows,

            }
        })
    } catch (error) {
        reject(error)
    }
})

// CREATE
export const createBook = (body, fileData) => new Promise(async (resolve, reject) => {
    try {
        const resp = await db.Book.findOrCreate({
            where: {title: body?.title},
            // raw: true,
            defaults: {
                ...body,
                id: generateId(),
                image: fileData?.path,
                filename: fileData?.filename
            }
        })
        resolve({
            err: resp[1] ? 0 : 1,
            mes: resp[1] ? 'Create book success' : 'Cannot create book, or title book is exist',
            bookData: resp[0]
        })
        if (!resp[1] && fileData) cloudinary.uploader.destroy(fileData.filename) // if book is exist, delete image from cloudinary
    } catch (error) {
        reject(error)
        if (fileData) cloudinary.uploader.destroy(fileData.filename) // if error, delete image from cloudinary
    }
})

// UPDATE
export const updateBook = ({id, ...body}, fileData) => new Promise(async (resolve, reject) => {
    try {
        if (fileData) body.image = fileData?.path // if fileData is exist, add image to body
        const resp = await db.Book.update(
            body,
            {
                where: {id: id}
            })
        resolve({
            err: resp[0] > 0 ? 0 : 1, // resp[0] is number of rows affected
            mes: resp[0] > 0 ? `${resp[0]} book updated` : 'Cannot update book',
        })
        if (resp[0] === 0 && fileData) cloudinary.uploader.destroy(fileData.filename) // if book is not exist, delete image from cloudinary
    } catch (error) {
        reject(error)
        if (fileData) cloudinary.uploader.destroy(fileData.filename) // if error, delete image from cloudinary
    }
})

// DELETE
/*
params={
  ids: [id1, id2],
  filename: [filename1, filename2]
}
*/
export const deleteBook = (ids, filename) => new Promise(async (resolve, reject) => {
    try {
        const resp = await db.Book.destroy({
            where: {id: ids}
        })
        resolve({
            err: resp > 0 ? 0 : 1, // resp[0] is number of rows affected
            mes: resp > 0 ? `${resp} book deleted` : 'Cannot delete book',
        })
        if (resp > 0 && filename) cloudinary.api.delete_resources(filename) // if book is exist, delete image from cloudinary
    } catch (error) {
        reject(error)
    }
})

// external service
export const createCategory = (body) => new Promise(async (resolve, reject) => {
    try {
        const resp = await db.Category.findOrCreate({
            where: {code: body.code},
            defaults: body
        })
        resolve({
            err: resp[1] ? 0 : 1,
            mes: resp[1] ? 'Create category success' : 'Cannot create category, or code category is exist',
            categoryData: resp[0]
        })
    } catch (error) {
        reject(error)
    }
})

export const getCategory = () => new Promise(async (resolve, reject) => {
    try {
        const resp = await db.Category.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        resolve({
            err: resp ? 0 : 1,
            mes: resp ? 'Get categories success ' : ' Cannot get categories',
            categoryData: resp
        })
    } catch (error) {
        reject(error)
    }
})

