const authController = require('./authController');
const authValidation = require('./authValidation');
const express = require('express');

const router = express.Router();
router.post('/signup', authController.signup, authValidation.signupValidator);
router.post('/login', authController.login, authValidation.loginValidator);

module.exports = router;