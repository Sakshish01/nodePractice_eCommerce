const mongoose = require("mongoose"),
{Schema} = mongoose;

const addressSchema = new Schema({
    houseNo: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['home','work','other'],
        default: 'home'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    otherDetails:{
        name: String,
        recieversName: String,
        recieverPhoneNo: Number
    }
});

module.exports = mongoose.model('Address', addressSchema);
