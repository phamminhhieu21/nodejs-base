import db from "../models";
import data from '../../data/data.json'
import { generateCode } from '../utils/helpers/db';
export const insertData = () => 
  new Promise( async(resolve, reject) =>{
    try{
      let categories = Object.keys(data).reduce((acc, current) => {
        acc.push({
          code: generateCode(current),
          value : current
        })
        return acc
      }, [])
      let books =  Object.keys(data).reduce((acc, current) => {
        acc.push(...data[current].map(item => {
          return {
            id : item.upc,
            title : item.bookTitle,
            price : item.bookPrice,
            available : +item.available,
            image : item.imageUrl,
            description : item.bookDescription,
            category_code : generateCode(current)
          }
        }))
        return acc
      }, [])

      // const response = await db.Category.bulkCreate(categories)
      const response = await db.Book.bulkCreate(books)
      resolve({
        err: response ? 0 : 1,
        message: response ? 'Inserted' : 'Failed to insert',
        dataPreview: response
      })
    } catch (error) {
      reject(error)
    }
  })
  
