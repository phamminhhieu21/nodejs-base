import * as controllers from '../controllers'
import express from 'express'
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware'
import { isAdmin } from '../middlewares/verifyRoleMiddleware'
const router = express.Router()

// PUBLIC ROUTES
// PRIVATE ROUTES
// router.use(verifyTokenMiddleware) // add verifyTokenMiddleware middleware to all routes below
// router.use(isAdmin) // add isAdmin middleware to all routes below
router.get('/', controllers.insertData)

export default router
