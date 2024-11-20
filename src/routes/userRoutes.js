const express = require('express');
const router = express.Router();
const  UserController  = require('../controllers/userController.js');
const  validateUser  = require('../middleware/validation.js');
const auth = require('../middleware/auth');

router.post('/register', validateUser, UserController.register);
router.post('/login', UserController.login);
router.get('/profile/:user_id', auth, UserController.getProfile);

module.exports = router;