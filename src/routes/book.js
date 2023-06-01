import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import { isAdmin, isCreatorOrAdmin } from '../middlewares/verifyRole'
import uploadCloud from '../middlewares/uploadCloud'
const router = express.Router()

//* PUBLIC ROUTES
router.get('/', controllers.getBooks)

//* PRIVATE ROUTES
router.use(verifyToken)
router.use(isCreatorOrAdmin)
router.post('/',uploadCloud.single('image'), controllers.createBook)
router.put('/',uploadCloud.single('image'), controllers.updateBook)
router.delete('/', controllers.deleteBook)
// external service
router.post('/category', controllers.createCategory)
router.get('/category', controllers.getCategory)
export default router
