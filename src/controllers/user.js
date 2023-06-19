import * as services from "../services"
import { internalServerError} from "../middlewares/handleErrors"


export const getCurrent = async (req, res) => {
    try {
        const { idUser } = req.params // get user id from req object (added by verifyToken middleware)
        const response = await services.getOne(idUser)
        return res.status(200).json(response)

    } catch (error) {
        return internalServerError(res);
    }
}