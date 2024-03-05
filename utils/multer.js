const multer = require("multer");

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/profiles/')
    },
    filename: function (req, file, cb){ // Corrected "filename" here
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const productImageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/products/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const categoryImageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/categories/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const offerImageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/offers/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const profileUpload = multer({storage: profileStorage});
const productUpload = multer({storage: productImageStorage});
const categoryUpload = multer({storage: categoryImageStorage});
const offerUpload = multer({storage: offerImageStorage});

module.exports = { profileUpload, productUpload, categoryUpload, offerUpload };
