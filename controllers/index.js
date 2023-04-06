const { signUp, signIn, getUser, authenJWT, checkUser, checkPhone, checkEmail } = require('./auth_controller')

module.exports = {
    signUp,
    signIn,
    getUser,
    authenJWT,
    checkUser,
    checkEmail,
    checkPhone,
}