 const mongoose = require("mongoose"),
 {Schema} = mongoose;
 const bcrypt = require("bcrypt");

 const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNo: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    profileImage: {
        type: String
    },
    refreshAccessToken: {
        type: String
    }
 },
 {
    timestamps: true
 });

 userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next;
    // console.log("hello");
    this.password = await bcrypt.hash(this.password, 10) //10 salt rounds
    next();
 });


 module.exports = mongoose.model('User', userSchema);
