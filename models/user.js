const mongoose = require('mongoose');

const phoneValidator = (phone) => {
    return /^\d{10}$/.test(phone);
};

const usernameValidator = (username) => {
    return /.*[a-zA-Z].*/.test(username);
}

const fullnameValidator = (fullname) => {
    return /^[^\d]*$/.test(fullname);
}

const emailValidator = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 8,
        validate: {
            validator: usernameValidator,
            message: '${props.value} is not a valid username'
        }
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
        validate: {
            validator: fullnameValidator,
            message: '${props.value} is not a valid name!'
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: phoneValidator,
            message: '${props.value} is not a valid phone number!'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: emailValidator,
            message: '${props.value} is not a valid email!'
        }
    },
    avatar: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: false,
        required: true,
    },
    activeToken: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("User", UserSchema);