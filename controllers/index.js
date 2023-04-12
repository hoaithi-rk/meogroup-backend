const { signUp, signIn, checkVerifyToken, authenJWT, checkUser, checkPhone, checkEmail } = require('./auth_controller')

module.exports = {
    signUp,
    signIn,
    checkVerifyToken,
    authenJWT,
    checkUser,
    checkEmail,
    checkPhone,
}