const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models');
const { default: mongoose } = require('mongoose');
const { sendEmail } = require('../utils')

const signUp = async (req, res) => {
    const username = req.body.username;
    const phone = req.body.phone;
    const email = req.body.email;

    let missingFields = [];
    if (!username) missingFields.push('username');
    if (!phone) missingFields.push('phone');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing ${missingFields.join(', ')}. Please fill in these fields`
        })
    } 

    const userExist = await User.findOne({
        $or: [
            { username: username },
            { phone: phone },
            { email: email }
        ]
    })

    if (userExist) {
        let message = ''
        if (userExist.username === username) {
            message = 'Username existed'
        }

        if (userExist.phone === phone) {
            message = 'Phone existed'
        }

        if (userExist.email === email) {
            message = 'Email existed'
        }

        return res.status(409).json({
            message
        })
    }

    try {
        const newUser = await User.create({
            username: username,
            phone: phone,
            email: email,
            active: false,
        })

        const activeToken = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })
        newUser.set({ activeToken: activeToken})
        newUser.save()

        const activateURL = `/users/verify/?activeToken=${activeToken}`;
        // const activateURL = `${process.env.HOST_FRONTEND}/`;
        const mailInfo = {
            destination: email,
            subject: 'ConMeoMeoMeo - Verify Your Account and Set Up Your Password',
            username: username,
            url: activateURL,
            message: 'You\'re almost ready to start enjoying our website',
            messageAction: 'Please follow the link provided <br> below to set up the password',
            action: 'Verify'
        } 
        await sendEmail(mailInfo);
        res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({
            message: 'Unexpected error',
            error
        })
    }

}

const signIn = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect Password",
            })
        }

        const token = jwt.sign({ id: user._id, username: user.username}, process.env.JWT_SECRET, {
            expiresIn: '24h',
        })
        return res.status(200).json({
            message: "User logged in successfully",
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occured',
            error,
        })
    }
}

const checkVerifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.sendStatus(401);
    }
    try {
        const verifyToken = authHeader.split(' ')[1];

        // jwt.verify(verifyToken, process.env.JWT_SECRET);

        const user = await User.findOne({ activeToken: verifyToken }) 

        console.log(user)
        if (!user) {
            return res.status(404).json({
                message: 'not found'
            });
        }

        return res.status(200).json({
            message: 'found' 
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: error.message
            })
        }
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: error.message
        })
    }

}

const authenJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        })
    } else {
        return res.sendStatus(401);
    }
}

const checkUser = async (req, res) => {
    const username = req.query.username;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            return res.status(200).json({
                exist: true,
            });
        } else {
            return res.status(200).json({
                exist: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Unexpected error",
            error
        })
    }
}

const checkPhone = async (req, res) => {
    const phone = req.query.phone;
    try {
        const user = await User.findOne({ phone: phone});
        if (user) {
            return res.status(200).json({
                exist: true,
            })
        } else {
            return res.status(200).json({
                exist: false,
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Unexpected error",
            error,
        });
    }
}

const checkEmail = async (req, res) => {
    const email = req.query.email;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).json({
                exist: true,
            });
        } else {
            return res.status(200).json({
                exist: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Unexpected error",
            error,
        });
    }
}

module.exports = {
    signUp,
    signIn,
    authenJWT,
    checkVerifyToken,
    checkUser,
    checkEmail,
    checkPhone,
}