const multer = require('multer');

const storageAvatar = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const date = new Date().toISOString();
        cb(null, date + '-' + file.originalname);
    }
})
const verifyForm = multer({
    storage: storageAvatar,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

module.exports = { verifyForm }