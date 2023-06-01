import db from '../models'


export const getOne = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id: userId },
            attributes: {
                exclude: ['password', 'role_code', 'refresh_token']
            },
            include: [
                { model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value'] } // as : 'roleData' is the alias of the model Role in User model (src\models\user.js) 
            ]
        })
        resolve({
            err: response ? 0 : 1,
            message: response ? 'Got' : 'User not found',
            userData: response
        })
    } catch (error) {
        reject(error)
    }
})
