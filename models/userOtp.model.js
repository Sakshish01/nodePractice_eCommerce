const mongoose = require("mongoose"),
{Schema} = mongoose;

const otpSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Otp', otpSchema);