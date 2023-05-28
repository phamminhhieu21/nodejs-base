import express from 'express';
import * as controller from '../controllers'
const router = express.Router();
router.post('/register', controller.register);
module.exports = router;