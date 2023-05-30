import * as services from "../services"
import { internalServerError} from "../middlewares/handleErrors"


export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user // get user id from req object (added by verifyToken middleware) 
        const response = await services.getOne(id)
        return res.status(200).json(response)

    } catch (error) {
        return internalServerError(res);
    }
}