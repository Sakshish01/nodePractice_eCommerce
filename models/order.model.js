const mongoose = require("mongoose"),
  { Schema } = mongoose;

const orderSchema = Schema(
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
        }
      },
    ],
    offerId: {
      type: Schema.Types.ObjectId,
      ref: 'Offer'
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      // required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returning", "Returned", "Replacing", "Replaced"],
      default: "Pending"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
