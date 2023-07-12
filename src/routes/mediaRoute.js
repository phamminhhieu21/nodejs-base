import * as controllers from '../controllers'
import express from 'express'
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware'
import {isAdmin, isCreatorOrAdmin} from '../middlewares/verifyRoleMiddleware'
import uploadCloud from '../middlewares/uploadCloudMiddleware'

const router = express.Router()

//* PUBLIC ROUTES

//* PRIVATE ROUTES
router.use(verifyTokenMiddleware)
router.use(isCreatorOrAdmin)
router.get('/get-photos', controllers.getPhotos)
router.post('/upload-photo', uploadCloud.single('photo'), controllers.uploadPhoto)
export default router
