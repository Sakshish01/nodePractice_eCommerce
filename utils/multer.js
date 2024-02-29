const multer = require("multer");

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/profiles/')
    },
    filename: function (req, file, cb){ // Corrected "filename" here
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const profileUpload = multer({storage: profileStorage});

module.exports = {profileUpload};
