import db from '../models'


export const getOne = (idUser) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id: idUser },
            attributes: {
                exclude: ['password', 'role_code', 'refresh_token', 'createdAt', 'updatedAt']
            },
            include: [
                { model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value'] } // as : 'roleData' is the alias of the model Role in User model (src\models\user.js) 
            ]
        })
        resolve({
            err: response ? 0 : 1,
            message: response ? `Get profile ${response.name} success` : 'User not found',
            userData: response
        })
    } catch (error) {
        reject(error)
    }
})
export const updateProfileUser = ({id , ...body}, fileData) => new Promise(async (resolve, reject) => {
    try {
        if(fileData) body.avatar = fileData?.path // if fileData is exist, add image to body
        body.filenameAvatar = fileData?.filename // add filename to body to delete image from cloudinary when update user failed
        const resp = await db.User.update(
          body,
          {
              where: { id }
          })
        resolve({
            err: resp[0] ? 0 : 1, // resp[0] is number of rows affected
            mes: resp[0]  ? `User updated` : 'Cannot update user',
            dataUpdate : resp[0] ? body : null
        })
        if(resp[0] === 0 && fileData) cloudinary.uploader.destroy(fileData.filename)
    } catch (error) {
        reject(error)
        if(fileData) cloudinary.uploader.destroy(fileData.filename) // if error, delete image from cloudinary
    }
})
