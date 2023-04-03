const mongoose = require('mongoose');

const phoneValidator = (phone) => {
    return /^\d{10}$/.test(phone);
};

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true
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
    },
    avatar: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("User", UserSchema);