const mongoose = require("mongoose"),
  { Schema } = mongoose;

const cartModel = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: false
        },
        colour: {
          type: String,
          required: false
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartModel);
