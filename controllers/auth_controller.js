const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const signUp = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const fullname = req.body.fullname;

    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPass, phone, fullname});

        res.status(201).json({message: 'User create successfully', user: newUser});
    } catch (error) {
        res.status(500).json({message: 'An error occured', error});
    }
}

const signIn = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            })
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h' 
        })

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                fullname: user.fullname
            },
            token,
        });
    } catch (error) {
        res.status(500).json({
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
        res.sendStatus(401);
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

module.exports = {
    signUp,
    signIn,
    getUser,
    authenJWT,
}