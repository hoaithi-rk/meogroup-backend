const express = require('express');
const { signUp, signIn, getUser, authenJWT, checkUser, checkEmail, checkPhone } = require('../controllers');

const userRoutes = express.Router();

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
userRoutes.get('/', authenJWT, getUser);
userRoutes.get('/check-username', checkUser)
userRoutes.get('/check-phone', checkPhone)
userRoutes.get('/check-email', checkEmail)

module.exports = userRoutes;