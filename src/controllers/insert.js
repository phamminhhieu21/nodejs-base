import * as services from '../services';
import {badRequest, internalServerError} from '../middlewares/handleErrorMiddleware'

export const insertData = async (req, res) => {
  try {
    const response = await services.insertData()
    res.status(200).json(response)
  } catch (error) {
    internalServerError(res)
  }
}