const mongoose = require("mongoose"),
{Schema} = mongoose;

const cartModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Cart', cartModel);