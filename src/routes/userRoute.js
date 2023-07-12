import * as controllers from '../controllers'
import express from 'express'
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware'
import {isAdmin} from '../middlewares/verifyRoleMiddleware'
import uploadCloud from '../middlewares/uploadCloudMiddleware'

const router = express.Router()

router.use(verifyTokenMiddleware) // add verifyTokenMiddleware middleware to all routes below
// router.use(isAdmin) // add isAdmin middleware to all routes below
// router.get('/:idUser', controllers.getCurrent)
router.post('/update-profile', uploadCloud.single('avatar'), controllers.updateProfileUser)


module.exports = router
