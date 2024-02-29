const mongoose = require("mongoose"),
{Schema} = mongoose;

const paymentSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    method:{
        type: String,
        enum: ["Card", "Cash", "UPI"],
        default: "Card"
    },
    status: {
        type: String,
        enum : ["Pending", "Success", "Failed"],
        default: "Pending"
    },
    
});

module.exports = mongoose.model('Payment', paymentSchema);