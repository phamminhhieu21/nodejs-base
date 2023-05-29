import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import { isAdmin } from '../middlewares/verifyRole'
const router = express.Router()

// PUBLIC ROUTES
// PRIVATE ROUTES
// router.use(verifyToken) // add verifyToken middleware to all routes below
// router.use(isAdmin) // add isAdmin middleware to all routes below
router.get('/',[verifyToken, isAdmin], controllers.getCurrent)


module.exports = router
