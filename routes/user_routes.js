const express = require('express');
const { signUp, signIn, verify, checkVerifyToken, authenJWT, checkUser, checkEmail, checkPhone } = require('../controllers');
const { verifyForm } = require('../config/multer.js')



const userRoutes = express.Router();

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
// userRoutes.post('/verify', verifyForm.single('avatar'), verify);
userRoutes.get('/check-verify-token', checkVerifyToken)
userRoutes.get('/check-username', checkUser)
userRoutes.get('/check-phone', checkPhone)
userRoutes.get('/check-email', checkEmail)

module.exports = userRoutes;