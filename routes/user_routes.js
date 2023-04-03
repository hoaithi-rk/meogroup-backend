const express = require('express');
const { signUp, signIn, getUser, authenJWT } = require('../controllers');

const userRoutes = express.Router();

userRoutes.post('/signup', signUp);
userRoutes.post('/signin', signIn);
userRoutes.get('/', authenJWT, getUser);

module.exports = userRoutes;