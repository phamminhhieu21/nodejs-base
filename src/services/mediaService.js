import db from "../models";
import {v4 as generateId} from 'uuid'
const cloudinary = require('cloudinary').v2

// READ
export const getPhotos = (userId) => new Promise(async (resolve, reject) => {
  try {
      const resp = await db.Media.findAndCountAll({
        where: { userId }, attributes: { exclude: ['userId']}, include: [{ model: db.User, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'userData' }],
        raw : true // return plain object instead of sequelize object
      })
      resolve({
        err: resp ? 0 : 1,
        mes: resp ? 'Get photos success' : 'Cannot get photos',
        photos: resp
      })
  } catch (error) {
      reject(error)
  }
})
// CREATE
export const uploadPhoto = (userId, fileData) => new Promise(async (resolve, reject) => {
  try {
      const resp = await db.Media.create({
        id: generateId(),
        userId: userId,
        photo : fileData?.path,
        filename : fileData?.filename
      })
      console.log('resp', resp)
      resolve({ 
          err: resp ? 0 : 1,
          mes: resp ? 'Upload photo success' : 'Cannot upload photo',
          photoData: resp
      })
      if(!resp && fileData) cloudinary.uploader.destroy(fileData.filename) // if book is exist, delete image from cloudinary 
  } catch (error) {
      console.log('error', error)
      reject(error)
      if(fileData) cloudinary.uploader.destroy(fileData.filename) // if error, delete image from cloudinary
  }
})

// DELETE
/*
params={
  ids: [id1, id2],
  filename: [filename1, filename2]
}
*/
export const deletePhoto = (ids, filename) => new Promise(async (resolve, reject) => {
  // try {
  //   const resp = await db.Book.destroy({
  //     where: { id: ids}
  //   })
  //   resolve({
  //     err: resp > 0 ? 0 : 1, // resp[0] is number of rows affected 
  //     mes: resp > 0 ? `${resp} book deleted` : 'Cannot delete book',
  //   })
  //   if(resp > 0 && filename) cloudinary.api.delete_resources(filename) // if book is exist, delete image from cloudinary
  // } catch (error) {
  //     reject(error)
  // }
})

