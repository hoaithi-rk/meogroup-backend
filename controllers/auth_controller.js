const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models');
const { default: mongoose } = require('mongoose');

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
    } else if (password !== confirmPassword) {
        return res.status(400).json({
            message: 'Incorrect confirm password',
        });
    }

    userExist = await User.findOne({ username: username});
    if (userExist) {
        return res.status(401).json({
            message: 'User existed'
        })
    }

    try {
        await User.create({ username, phone, email, });

        return res.status(201).json({
            message: "User created successfully"
        })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            })
        } else {
            return res.status(500).json({
                message: "Unexpected error",
                error
            })
        }
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

const authenJWT = (req, res, next) => {
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

const getUser = async (req, res) => {
    try {
        console.log(req.user);
        await res.status(200).json({message: "hello"});
    } catch (error) {
        await res.status(400).json({message: "hi"});
        console.log(error);
    }
}

const checkUser = async (req, res) => {
    const username = req.query.username;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
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
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
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
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
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
    getUser,
    authenJWT,
    checkUser,
    checkEmail,
    checkPhone,
}