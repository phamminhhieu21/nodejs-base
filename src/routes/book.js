import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import { isAdmin } from '../middlewares/verifyRole'
const router = express.Router()

// PUBLIC ROUTES
router.get('/', controllers.getBooks)

// PRIVATE ROUTES

export default router
