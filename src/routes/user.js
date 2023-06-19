import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import { isAdmin } from '../middlewares/verifyRole'
import uploadCloud from '../middlewares/uploadCloud'
const router = express.Router()

router.use(verifyToken) // add verifyToken middleware to all routes below
// router.use(isAdmin) // add isAdmin middleware to all routes below
// router.get('/:idUser', controllers.getCurrent)
router.put('/update-profile',uploadCloud.single('avatar') ,controllers.updateProfileUser)


module.exports = router
