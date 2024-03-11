const mongoose = require("mongoose"),
  { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: {
        type: String,
        // required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    isReplacable: {
      type:Boolean,
      default: true
    },
    isReturnable: {
      type: Boolean,
      default: true
    },
    returnPeriodDays: {
      type: Number,
      default: 7
    },
    availableSizes: [{
      type: String
    }],
    availableColours: [{
      type: String,
    }],
    defaultSize: {
      type: String,
      required: true
    },
    defaultColour: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
