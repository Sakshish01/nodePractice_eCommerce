const mongoose = require("mongoose"),
{Schema} = mongoose;

const offerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "flat"],
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    minAmountToApply: {
        type: Number,
        required: true
    },
    useLimit: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    userType: {
        type: String,
        enum: ["new", "old", "all"],
        default: "all"
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('Offer', offerSchema);