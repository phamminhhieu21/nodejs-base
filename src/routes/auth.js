import express from 'express';
import * as controller from '../controllers'
const router = express.Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
module.exports = router;