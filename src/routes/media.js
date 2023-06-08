import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import { isAdmin, isCreatorOrAdmin } from '../middlewares/verifyRole'
import uploadCloud from '../middlewares/uploadCloud'
const router = express.Router()

//* PUBLIC ROUTES

//* PRIVATE ROUTES
router.use(verifyToken)
router.use(isCreatorOrAdmin)
router.get('/get-photos', controllers.getPhotos)
router.post('/upload-photo',uploadCloud.single('photo'), controllers.uploadPhoto)
export default router
