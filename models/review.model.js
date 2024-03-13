const mongoose = require("mongoose"),
{Schema} = mongoose;

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String
    },
    uploads: [{
        type: String
    }]
},
{
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);