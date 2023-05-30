import db from "../models";
import { Op } from 'sequelize'

// READ
export const getBooks = ({ page, limit, order, name, available, ...query }) => new Promise(async (resolve, reject) => {
  try {
      const queries = { raw: true, nest: true } // raw: true, nest: true is used to remove metadata from response
      const offset = (!page || +page <= 1) ? 0 : (+page - 1) // calculate offset from page number (default page = 1) 
      const fLimit = +limit || +process.env.LIMIT
      queries.offset = offset * fLimit
      queries.limit = fLimit
      if (order) queries.order = [order] 
      if (name) query.title = { [Op.substring]: name } // Op.substring is used to find substring in string
      if (available) query.available = { [Op.between]: available } // Op.between is used to find value between two values
      const response = await db.Book.findAndCountAll({ // findAndCountAll is used to get total count of rows in table 
          where: query,
          ...queries,
          attributes: {
              exclude: ['category_code', 'description']
          },
          include: [
              { model: db.Category, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'categoryData' }
          ]
      })
      resolve({
          err: response ? 0 : 1,
          mes: response ? 'Got' : 'Cannot found books',
          bookData: response
      })
  } catch (error) {
      reject(error)
  }
})
// CREATE
// UPDATE
// DELETE

