const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    url: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Image", ImageSchema);