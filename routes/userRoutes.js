const express = require("express");
const {register, login, logout, forgetPassword, otpVerify, resetPassword, changePassword} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/forget/password', forgetPassword);
router.post('/verify/otp', otpVerify);
router.post('/reset/password/:id', resetPassword);

// console.log("hello");


//secured routes
router.post('/logout',protect, logout);
router.post('/change/password', protect, changePassword);

module.exports = router;